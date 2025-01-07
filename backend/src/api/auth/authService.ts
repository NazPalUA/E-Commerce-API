import { User_DTO } from '@/api/user/userModel';
import { User_DbEntity } from '@/common/db/repos/users/user.model';
import { userRepo } from '@/common/db/repos/users/user.repo';
import { NotFoundError } from '@/common/errors/not-found-error';
import { UnauthorizedError } from '@/common/errors/unauthorized-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { env } from '@/common/utils/envConfig';
import { toDTO } from '@/common/utils/toDTO';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import {
  Login_ReqBody,
  Register_ReqBody,
  Register_ResObj,
  UserToken,
} from './authModel';

class AuthService {
  private userRepo = userRepo;

  public async register(
    userData: Register_ReqBody
  ): Promise<ServiceResponse<Register_ResObj>> {
    const { password, ...rest } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const isFirstUser = (await this.userRepo.countDocuments()) === 0;

    const newUser = {
      ...rest,
      password: hashedPassword,
      role: isFirstUser ? 'admin' : ('user' as User_DbEntity['role']),
    };

    const insertedUser = await this.userRepo.insertUser(newUser);

    const tokenUser: UserToken = {
      id: insertedUser._id.toString(),
      name: insertedUser.name,
      email: insertedUser.email,
      role: insertedUser.role,
    };

    const token = jwt.sign(tokenUser, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRATION_TIME,
    });

    const response: Register_ResObj = {
      user: tokenUser,
      token,
    };

    return ServiceResponse.success<Register_ResObj>(
      'User registered',
      response
    );
  }

  public async login(
    credentials: Login_ReqBody
  ): Promise<ServiceResponse<{ token: string }>> {
    const { email, password } = credentials;
    const user = await this.userRepo.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError('User');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRATION_TIME,
    });

    return ServiceResponse.success<{ token: string }>('Login successful', {
      token,
    });
  }

  public async logout(userId: string): Promise<ServiceResponse<null>> {
    // If you want to blacklist JWT or handle user sessions, do it here
    return ServiceResponse.success<null>('Logout successful', null);
  }

  public async getCurrentUser(
    userId: string
  ): Promise<ServiceResponse<User_DTO>> {
    const user = await this.userRepo.findUserById(new ObjectId(userId));
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
