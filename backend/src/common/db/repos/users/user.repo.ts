import { Collection, ObjectId } from 'mongodb';
import { collections } from '../..';
import { NewUser, User_DbEntity, User_DbEntity_Schema } from './user.model';

export class UserRepository {
  private get collection(): Collection<User_DbEntity> {
    return collections.users;
  }

  public async insertUser(user: NewUser): Promise<User_DbEntity> {
    const candidate = User_DbEntity_Schema.parse({
      ...user,
      _id: new ObjectId(),
    });
    const result = await this.collection.insertOne(candidate);
    return { ...candidate, _id: result.insertedId };
  }

  public async updateUser(
    userId: ObjectId,
    userData: Partial<User_DbEntity>
  ): Promise<User_DbEntity | null> {
    const updatedUser = await this.collection.findOneAndUpdate(
      { _id: userId },
      { $set: userData },
      { returnDocument: 'after' }
    );

    return updatedUser;
  }

  public async findAllUsers(): Promise<User_DbEntity[]> {
    return this.collection.find().toArray();
  }

  public async findUserById(userId: ObjectId): Promise<User_DbEntity | null> {
    return this.collection.findOne({ _id: userId });
  }

  public async findUserByEmail(email: string): Promise<User_DbEntity | null> {
    return this.collection.findOne({ email });
  }

  public async countDocuments(): Promise<number> {
    return this.collection.countDocuments();
  }
}

export const userRepo = new UserRepository();
