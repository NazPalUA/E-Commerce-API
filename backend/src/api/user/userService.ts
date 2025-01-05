import { NotFoundError } from '@/common/errors/not-found-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { collections } from '@/common/services/database.service';
import { toDTO } from '@/common/utils/toDTO';
import { Collection, ObjectId } from 'mongodb';
import type { CreateUserReqBody, UserDTO, UserEntity } from './userModel';

export class UserService {
  private get collection(): Collection<UserEntity> {
    return collections.users;
  }

  async createUser(user: CreateUserReqBody): Promise<ServiceResponse<UserDTO>> {
    const newUser: UserEntity = {
      _id: new ObjectId(),
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.collection.insertOne(newUser);

    return ServiceResponse.success<UserDTO>('User created', toDTO(newUser));
  }

  async findAll(): Promise<ServiceResponse<UserDTO[] | null>> {
    const users = await this.collection.find().toArray();
    if (!users || users.length === 0) {
      throw new NotFoundError('No Users');
    }

    return ServiceResponse.success<UserDTO[]>('Users found', users.map(toDTO));
  }

  async findById(id: string): Promise<ServiceResponse<UserDTO | null>> {
    const user = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new NotFoundError('User');
    }

    return ServiceResponse.success<UserDTO>('User found', toDTO(user));
  }
}

export const userService = new UserService();
