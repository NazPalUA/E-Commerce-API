import type { Request, RequestHandler, Response } from 'express';

import { userService } from '@/api/user/userService';
import {
  handleServiceResponse,
  validateReq,
} from '@/common/utils/httpHandlers';
import { CreateUser_Req_Schema, GetUser_Req_Schema } from './userModel';

class UserController {
  public getUsers: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    handleServiceResponse(serviceResponse, res);
  };

  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const { params } = validateReq(req, GetUser_Req_Schema);

    const serviceResponse = await userService.findById(params.id);
    handleServiceResponse(serviceResponse, res);
  };

  public createUser: RequestHandler = async (req: Request, res: Response) => {
    const { body } = validateReq(req, CreateUser_Req_Schema);

    const serviceResponse = await userService.createUser(body);
    handleServiceResponse(serviceResponse, res);
  };
}

export const userController = new UserController();
