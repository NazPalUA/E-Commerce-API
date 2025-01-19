import { User_DTO } from '@/db/repos/users/user.model';
import { BadRequestError } from '@/errors/bad-request-error';
import { NotFoundError } from '@/errors/not-found-error';
import { InternalServerError } from '@/errors/server-error';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { AccessJWTPayload } from '@/models/AccessToken';
import bcrypt from 'bcrypt';
import { Collection, ObjectId } from 'mongodb';
import { collections } from '../..';
import { UserRoles } from './constants';
import {
  User_DbEntity,
  User_DbEntity_Schema,
  User_DTO_Schema,
} from './user.model';

class UserRepository {
  private get collection(): Collection<User_DbEntity> {
    return collections.users;
  }

  private getDTO = (entity: User_DbEntity): User_DTO => {
    const { _id, ...rest } = entity;
    const candidate = {
      id: _id.toHexString(),
      ...rest,
    };
    const userDTO = User_DTO_Schema.safeParse(candidate);
    if (!userDTO.success)
      throw new InternalServerError('Failed to parse user DTO');
    return userDTO.data;
  };

  private async countDocuments(): Promise<number> {
    return this.collection.countDocuments();
  }

  private async checkPassword(
    userId: string,
    candidatePassword: string
  ): Promise<boolean> {
    const user = (await this.collection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 1, _id: 0 } }
    )) as Pick<User_DbEntity, 'password'>;
    if (!user) throw new NotFoundError('User not found');

    const isPasswordCorrect = await bcrypt.compare(
      candidatePassword,
      user.password
    );

    return isPasswordCorrect;
  }

  public async registerNew(
    user: Pick<
      User_DbEntity,
      'name' | 'email' | 'password' | 'verificationToken'
    >
  ): Promise<User_DTO> {
    const isFirstUser = (await this.countDocuments()) === 0;

    const candidate = User_DbEntity_Schema.safeParse({
      _id: new ObjectId(),
      role: isFirstUser ? UserRoles.ADMIN : UserRoles.USER,
      ...user,
    });
    if (!candidate.success)
      throw new InternalServerError('Failed to parse user');

    const result = await this.collection.insertOne(candidate.data);
    if (!result.acknowledged)
      throw new InternalServerError('Failed to insert user');

    const userDTO = this.getDTO({
      ...candidate.data,
      _id: result.insertedId,
    });
    return userDTO;
  }

  public async verify(email: string, verificationToken: string): Promise<void> {
    const user = (await this.collection.findOne(
      { email },
      { projection: { verificationToken: 1, isVerified: 1, _id: 0 } }
    )) as Pick<User_DbEntity, 'verificationToken' | 'isVerified'>;
    if (!user) throw new NotFoundError('User not found');

    if (user.isVerified) throw new BadRequestError('Email already verified');

    if (user.verificationToken !== verificationToken)
      throw new BadRequestError('Invalid verification token');

    const updateData: Partial<User_DbEntity> = {
      isVerified: true,
      verifiedDate: new Date(),
      updatedAt: new Date(),
      verificationToken: undefined,
    };

    const result = await this.collection.updateOne(
      { email },
      { $set: updateData }
    );
    if (result.modifiedCount === 0)
      throw new InternalServerError('Failed to verify user');
  }

  public async checkPasswordAndVerification(
    email: string,
    candidatePassword: string
  ): Promise<AccessJWTPayload> {
    const projection = {
      name: 1,
      email: 1,
      role: 1,
      password: 1,
      isVerified: 1,
    };
    const user = (await this.collection.findOne(
      { email },
      { projection }
    )) as Pick<
      User_DbEntity,
      '_id' | 'password' | 'isVerified' | 'name' | 'email' | 'role'
    >;

    if (!user) throw new UnauthorizedError('Email or password is incorrect');

    if (!user.isVerified) throw new UnauthorizedError('Email not verified');

    const isPasswordCorrect = await bcrypt.compare(
      candidatePassword,
      user.password
    );
    if (!isPasswordCorrect)
      throw new UnauthorizedError('Email or password is incorrect');

    const accessJWTPayload: AccessJWTPayload = {
      id: user._id.toHexString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return accessJWTPayload;
  }

  public async updatePasswordResetToken(
    userId: string,
    passwordResetToken: string,
    passwordResetTokenExpiration: Date
  ): Promise<void> {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { passwordResetToken, passwordResetTokenExpiration } }
    );
    if (result.matchedCount === 0) throw new NotFoundError('User not found');

    if (result.modifiedCount === 0)
      throw new InternalServerError('Failed to update password reset token');
  }

  public async checkPasswordResetToken(
    userEmail: string,
    passwordResetToken: string
  ): Promise<void> {
    const projection = {
      passwordResetToken: 1,
      passwordResetTokenExpiration: 1,
      _id: 0,
    };
    const user = (await this.collection.findOne(
      { email: userEmail },
      { projection }
    )) as Pick<
      User_DbEntity,
      'passwordResetToken' | 'passwordResetTokenExpiration'
    >;
    if (!user) throw new NotFoundError('User not found');

    if (
      user.passwordResetToken !== passwordResetToken ||
      !user.passwordResetTokenExpiration ||
      user.passwordResetTokenExpiration < new Date()
    )
      throw new BadRequestError('Invalid or expired reset token');
  }

  public async resetPassword(
    userId: string,
    newPassword: string
  ): Promise<void> {
    const newHashedPassword =
      User_DbEntity_Schema.shape.password.parse(newPassword);

    const result = await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: newHashedPassword, updatedAt: new Date() } }
    );

    if (!result.matchedCount) throw new NotFoundError('User not found');
    if (result.modifiedCount === 0)
      throw new InternalServerError('Failed to update password');
  }

  public async updateUser(
    userId: string,
    userData: Partial<Pick<User_DbEntity, 'name' | 'email'>>
  ): Promise<User_DTO | null> {
    const updatedUser = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { ...userData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!updatedUser) throw new NotFoundError('User not found');

    return this.getDTO(updatedUser);
  }

  public async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const isPasswordCorrect = await this.checkPassword(userId, currentPassword);
    if (!isPasswordCorrect) throw new UnauthorizedError('Incorrect password');

    const isTheSamePassword = await this.checkPassword(userId, newPassword);
    if (isTheSamePassword)
      throw new BadRequestError('New password is the same as the old password');

    const newHashedPassword =
      User_DbEntity_Schema.shape.password.parse(newPassword);

    const result = await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: newHashedPassword, updatedAt: new Date() } }
    );

    if (!result.matchedCount) throw new NotFoundError('User not found');
    if (result.modifiedCount === 0)
      throw new InternalServerError('Failed to update password');
  }

  public async findAll(): Promise<User_DTO[]> {
    const users = await this.collection
      .find({ role: 'user' }, { projection: { password: 0 } })
      .toArray();
    return users.map(user => this.getDTO(user));
  }

  public async findUserById(userId: string): Promise<User_DTO | null> {
    const user = await this.collection.findOne({
      _id: new ObjectId(userId),
    });
    return user ? this.getDTO(user) : null;
  }

  public async findUserByEmail(email: string): Promise<User_DTO | null> {
    const user = await this.collection.findOne({ email });
    return user ? this.getDTO(user) : null;
  }
}

export const userRepo = new UserRepository();
