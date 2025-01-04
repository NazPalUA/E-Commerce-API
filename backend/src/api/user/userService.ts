import type { User } from '@/api/user/userModel';
import { UserRepository } from '@/api/user/userRepository';
import { NotFoundError } from '@/common/errors/not-found-error';
import { ServiceResponse } from '@/common/models/serviceResponse';

export class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<User[] | null>> {
    const users = await this.userRepository.findAllAsync();
    if (!users || users.length === 0) {
      throw new NotFoundError('No Users');
    }
    return ServiceResponse.success<User[]>('Users found', users);
  }

  // Retrieves a single user by their ID
  async findById(id: number): Promise<ServiceResponse<User | null>> {
    const user = await this.userRepository.findByIdAsync(id);
    if (!user) {
      throw new NotFoundError('User');
    }
    return ServiceResponse.success<User>('User found', user);
  }
}

export const userService = new UserService();
