import { BadRequestError } from '@/errors/bad-request-error';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { UserRoles } from '@/models/userRoles';
import bcrypt from 'bcrypt';
import { Collection, ObjectId } from 'mongodb';
import { collections } from '../..';
import {
  getUserDTO,
  NewUser,
  User_DbEntity,
  User_DbEntity_Schema,
  User_DTO,
} from './user.model';

export class UserRepository {
  private get collection(): Collection<User_DbEntity> {
    return collections.users;
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

  public async insertUser(user: NewUser): Promise<User_DTO> {
    const isFirstUser = (await this.countDocuments()) === 0;

    const candidate = User_DbEntity_Schema.parse({
      ...user,
      _id: new ObjectId(),
      role: isFirstUser ? UserRoles.ADMIN : UserRoles.USER,
    });
    const result = await this.collection.insertOne(candidate);
    const userDTO = getUserDTO({
      ...candidate,
      _id: result.insertedId,
    });
    return userDTO;
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

    return updatedUser ? getUserDTO(updatedUser) : null;
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

  public async findAllUsers(): Promise<User_DTO[]> {
    return this.collection
      .find({ role: 'user' }, { projection: { password: 0 } })
      .toArray()
      .then(users => {
        return users.map(user => getUserDTO(user));
      });
  }

  public async findUserById(userId: string): Promise<User_DTO | null> {
    return this.collection
      .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
      .then(user => {
        return user ? getUserDTO(user) : null;
      });
  }

  public async findUserByEmail(email: string): Promise<User_DTO | null> {
    return this.collection
      .findOne({ email }, { projection: { password: 0 } })
      .then(user => {
        return user ? getUserDTO(user) : null;
      });
  }

  public async countDocuments(): Promise<number> {
    return this.collection.countDocuments();
  }
}

export const userRepo = new UserRepository();
