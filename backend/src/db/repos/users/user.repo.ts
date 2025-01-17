import { BadRequestError } from '@/errors/bad-request-error';
import { InternalServerError } from '@/errors/server-error';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import bcrypt from 'bcrypt';
import { Collection, ObjectId } from 'mongodb';
import { collections } from '../..';
import { UserRoles } from './constants';
import {
  User_DbEntity,
  User_DbEntity_Input,
  User_DbEntity_Schema,
  User_DTO,
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

  public async checkPassword(
    userId: string,
    candidatePassword: string
  ): Promise<boolean> {
    const user = (await this.collection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 1 } }
    )) as Pick<User_DbEntity, 'password'>;
    return user
      ? await bcrypt.compare(candidatePassword, user.password)
      : false;
  }

  public async insertUser(user: User_DbEntity_Input): Promise<User_DTO> {
    const isFirstUser = (await this.countDocuments()) === 0;

    const candidate = User_DbEntity_Schema.parse({
      ...user,
      _id: new ObjectId(),
      role: isFirstUser ? UserRoles.ADMIN : UserRoles.USER,
    });
    const result = await this.collection.insertOne(candidate);
    const userDTO = this.getDTO({
      ...candidate,
      _id: result.insertedId,
    });
    return userDTO;
  }

  public async checkVerificationToken(
    userEmail: string,
    verificationToken: string
  ): Promise<boolean> {
    const user = await this.collection.findOne(
      { email: userEmail },
      { projection: { verificationToken: 1 } }
    );
    return user?.verificationToken === verificationToken;
  }

  public async checkPasswordResetToken(
    userEmail: string,
    passwordResetToken: string
  ): Promise<boolean> {
    const user = await this.collection.findOne({ email: userEmail });
    if (!user) return false;

    const isPasswordResetTokenCorrect =
      user.passwordResetToken === passwordResetToken;
    if (!isPasswordResetTokenCorrect) return false;

    const isPasswordResetTokenValid =
      user.passwordResetTokenExpiration &&
      user.passwordResetTokenExpiration > new Date();
    return isPasswordResetTokenValid === true;
  }

  public async verifyUser(userId: string): Promise<void> {
    await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          isVerified: true,
          verifiedDate: new Date(),
          updatedAt: new Date(),
          verificationToken: undefined,
        },
      }
    );
  }

  public async updateUser(
    userId: string,
    userData: Partial<Pick<User_DTO, 'name' | 'email'>>
  ): Promise<User_DTO | null> {
    const updatedUser = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { ...userData, updatedAt: new Date() } },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    return updatedUser ? this.getDTO(updatedUser) : null;
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
    if (result.modifiedCount === 0)
      throw new Error('Failed to update password');
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
    if (result.modifiedCount === 0)
      throw new Error('Failed to update password');
  }

  public async updateUserPasswordResetToken(
    userId: string,
    passwordResetToken: string,
    passwordResetTokenExpiration: Date
  ): Promise<void> {
    await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { passwordResetToken, passwordResetTokenExpiration } }
    );
  }

  public async findAllUsers(): Promise<User_DTO[]> {
    return this.collection
      .find({ role: 'user' }, { projection: { password: 0 } })
      .toArray()
      .then(users => {
        return users.map(user => this.getDTO(user));
      });
  }

  public async findUserById(userId: string): Promise<User_DTO | null> {
    return this.collection
      .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
      .then(user => {
        return user ? this.getDTO(user) : null;
      });
  }

  public async findUserByEmail(email: string): Promise<User_DTO | null> {
    return this.collection
      .findOne({ email }, { projection: { password: 0 } })
      .then(user => {
        return user ? this.getDTO(user) : null;
      });
  }
}

export const userRepo = new UserRepository();
