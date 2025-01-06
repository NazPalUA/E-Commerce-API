import { NotFoundError } from '@/common/errors/not-found-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { collections } from '@/common/services/database.service';
import { toDTO } from '@/common/utils/toDTO';
import { Collection, ObjectId } from 'mongodb';
import {
  User_DbEntity_Schema,
  type CreateUser_ReqBody,
  type User_DTO,
  type User_DbEntity,
} from './userModel';

export class UserService {
  private get collection(): Collection<User_DbEntity> {
    return collections.users;
  }

  async createUser(
    user: CreateUser_ReqBody
  ): Promise<ServiceResponse<User_DTO>> {
    const newUser = User_DbEntity_Schema.parse(user);
    await this.collection.insertOne(newUser);

    return ServiceResponse.success<User_DTO>('User created', toDTO(newUser));
  }

  async findAll(): Promise<ServiceResponse<User_DTO[] | null>> {
    const users = await this.collection.find().toArray();
    if (!users || users.length === 0) {
      throw new NotFoundError('No Users');
    }

    return ServiceResponse.success<User_DTO[]>('Users found', users.map(toDTO));
  }

  async findById(id: string): Promise<ServiceResponse<User_DTO | null>> {
    const user = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new NotFoundError('User');
    }

    return ServiceResponse.success<User_DTO>('User found', toDTO(user));
  }
}

export const userService = new UserService();
