import type {
  CreateUserReqBody,
  UserDTO,
  UserEntity,
} from '@/api/user/userModel';
import { NotFoundError } from '@/common/errors/not-found-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { collections } from '@/common/services/database.service';
import { Collection, ObjectId } from 'mongodb';

export class UserService {
  private get collection(): Collection<UserEntity> {
    return collections.users;
  }

  private toDTO(user: UserEntity): UserDTO {
    const { _id, ...rest } = user;
    return {
      id: _id.toString(),
      ...rest,
    };
  }

  async createUser(user: CreateUserReqBody): Promise<ServiceResponse<UserDTO>> {
    const newUser: UserEntity = {
      _id: new ObjectId(),
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.collection.insertOne(newUser);

    return ServiceResponse.success<UserDTO>(
      'User created',
      this.toDTO(newUser)
    );
  }

  async findAll(): Promise<ServiceResponse<UserDTO[] | null>> {
    const users = await this.collection.find().toArray();
    if (!users || users.length === 0) {
      throw new NotFoundError('No Users');
    }

    return ServiceResponse.success<UserDTO[]>(
      'Users found',
      users.map(this.toDTO)
    );
  }

  async findById(id: string): Promise<ServiceResponse<UserDTO | null>> {
    const user = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new NotFoundError('User');
    }
    return ServiceResponse.success<UserDTO>('User found', this.toDTO(user));
  }
}

export const userService = new UserService();
