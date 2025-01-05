import type { Request, RequestHandler, Response } from 'express';

import { userService } from '@/api/user/userService';
import {
  handleServiceResponse,
  validateReq,
} from '@/common/utils/httpHandlers';
import { CreateUserReqSchema, GetUserReqSchema } from './userModel';

class UserController {
  public getUsers: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    handleServiceResponse(serviceResponse, res);
  };

  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const { params } = validateReq(req, GetUserReqSchema);

    const serviceResponse = await userService.findById(params.id);
    handleServiceResponse(serviceResponse, res);
  };

  public createUser: RequestHandler = async (req: Request, res: Response) => {
    const { body } = validateReq(req, CreateUserReqSchema);

    const serviceResponse = await userService.createUser(body);
    handleServiceResponse(serviceResponse, res);
  };
}

export const userController = new UserController();
