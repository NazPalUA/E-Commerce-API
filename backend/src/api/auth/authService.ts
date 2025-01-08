import { User_DTO } from '@/api/user/userModel';
import { User_DbEntity } from '@/common/db/repos/users/user.model';
import { userRepo } from '@/common/db/repos/users/user.repo';
import { NotFoundError } from '@/common/errors/not-found-error';
import { UnauthorizedError } from '@/common/errors/unauthorized-error';
import { ServiceResponse } from '@/common/models/serviceResponse';
import {
  attachCookiesToResponse,
  clearCookies,
  TokenPayload,
} from '@/common/utils/jwt';
import { toDTO } from '@/common/utils/toDTO';
import bcrypt from 'bcrypt';
import { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  Login_ReqBody,
  Login_ResObj,
  Register_ReqBody,
  Register_ResObj,
} from './authModel';

class AuthService {
  private userRepo = userRepo;

  public async register(
    { password, ...rest }: Register_ReqBody,
    res: Response
  ): Promise<ServiceResponse<Register_ResObj>> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const isFirstUser = (await this.userRepo.countDocuments()) === 0;

    const newUser = {
      ...rest,
      password: hashedPassword,
      role: isFirstUser ? 'admin' : ('user' as User_DbEntity['role']),
    };

    const insertedUser = await this.userRepo.insertUser(newUser);

    const tokenUser: TokenPayload = {
      id: insertedUser._id.toString(),
      name: insertedUser.name,
      email: insertedUser.email,
      role: insertedUser.role,
    };

    attachCookiesToResponse(res, tokenUser);

    return ServiceResponse.success<Register_ResObj>(
      'User registered',
      tokenUser
    );
  }

  public async login(
    { email, password }: Login_ReqBody,
    res: Response
  ): Promise<ServiceResponse<Login_ResObj>> {
    const user = await this.userRepo.findUserByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new UnauthorizedError('Invalid credentials');

    const tokenUser: TokenPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    attachCookiesToResponse(res, tokenUser);

    return ServiceResponse.success<Login_ResObj>('Login successful', tokenUser);
  }

  public async logout(res: Response): Promise<ServiceResponse<null>> {
    clearCookies(res);
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
