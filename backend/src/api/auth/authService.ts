import { NotFoundError } from '@/common/errors/not-found-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { collections } from '@/common/services/database.service';
import { toDTO } from '@/common/utils/toDTO';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Collection, ObjectId } from 'mongodb';
import {
  User_DTO,
  User_DbEntity,
  User_DbEntity_Schema,
} from '../user/userModel';
import { Login_ReqBody, Register_ReqBody } from './authModel';

export class AuthService {
  private get collection(): Collection<User_DbEntity> {
    return collections.users;
  }

  async register(
    userData: Register_ReqBody
  ): Promise<ServiceResponse<User_DTO>> {
    const { password, ...rest } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      ...rest,
      password: hashedPassword,
    };

    const userEntity = User_DbEntity_Schema.parse(newUser);

    const result = await this.collection.insertOne(userEntity);
    const insertedUser = { ...userEntity, _id: result.insertedId };

    return ServiceResponse.success<User_DTO>(
      'User registered',
      toDTO(insertedUser)
    );
  }

  async login(
    credentials: Login_ReqBody
  ): Promise<ServiceResponse<{ token: string }>> {
    const { email, password } = credentials;
    const user = await this.collection.findOne({ email });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    return ServiceResponse.success<{ token: string }>('Login successful', {
      token,
    });
  }

  async logout(userId: string): Promise<ServiceResponse<null>> {
    // Implement logout logic if necessary
    return ServiceResponse.success<null>('Logout successful', null);
  }

  async getCurrentUser(userId: string): Promise<ServiceResponse<User_DTO>> {
    const user = await this.collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return ServiceResponse.success<User_DTO>(
      'Current user retrieved',
      toDTO(user)
    );
  }
}

export const authService = new AuthService();
