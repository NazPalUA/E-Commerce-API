import type { Request, RequestHandler, Response } from 'express';

import { userService } from '@/api/user/userService';
import {
  handleServiceResponse,
  validateReq,
} from '@/common/utils/httpHandlers';
import { GetUser_Req_Schema } from './userModel';

export const getUsers: RequestHandler = async (
  _req: Request,
  res: Response
) => {
  const serviceResponse = await userService.findAll();
  handleServiceResponse(serviceResponse, res);
};

export const getUser: RequestHandler = async (req: Request, res: Response) => {
  const { params } = validateReq(req, GetUser_Req_Schema);

  const serviceResponse = await userService.findById(params.id);
  handleServiceResponse(serviceResponse, res);
};
