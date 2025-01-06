import { NotFoundError } from '@/common/errors/not-found-error';
import { UnauthorizedError } from '@/common/errors/unauthorized-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { collections } from '@/common/services/database.service';
import { env } from '@/common/utils/envConfig';
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
    const isFirstUser = (await this.collection.countDocuments()) === 0;

    const newUser = {
      ...rest,
      password: hashedPassword,
      role: isFirstUser ? 'admin' : 'user',
    };

    const userToInsert = User_DbEntity_Schema.parse(newUser);

    const result = await this.collection.insertOne(userToInsert);
    const insertedUser = { ...userToInsert, _id: result.insertedId };

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
      throw new NotFoundError('User');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return ServiceResponse.success<{ token: string }>('Login successful', {
      token,
    });
  }

  async logout(userId: string): Promise<ServiceResponse<null>> {
    // Implement logout logic if necessary
    // Note: With JWT, typically no server-side logout is needed
    // You might want to implement a token blacklist if required
    return ServiceResponse.success<null>('Logout successful', null);
  }

  async getCurrentUser(userId: string): Promise<ServiceResponse<User_DTO>> {
    const user = await this.collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw new NotFoundError('User');
    }

    return ServiceResponse.success<User_DTO>(
      'Current user retrieved',
      toDTO(user)
    );
  }
}

export const authService = new AuthService();
