import { NotFoundError } from '@/common/errors/not-found-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { userRepo } from '@/common/services/db/repos/users/user.repo';
import { toDTO } from '@/common/utils/toDTO';
import { ObjectId } from 'mongodb';
import { type User_DTO } from './userModel';

export class UserService {
  private userRepo = userRepo;

  async findAll(): Promise<ServiceResponse<User_DTO[] | null>> {
    const users = await this.userRepo.findAllUsers();
    if (!users.length) {
      throw new NotFoundError('No Users');
    }

    return ServiceResponse.success<User_DTO[]>('Users found', users.map(toDTO));
  }

  async findById(id: string): Promise<ServiceResponse<User_DTO | null>> {
    const user = await this.userRepo.findUserById(new ObjectId(id));
    if (!user) {
      throw new NotFoundError('User');
    }

    return ServiceResponse.success<User_DTO>('User found', toDTO(user));
  }
}

export const userService = new UserService();
