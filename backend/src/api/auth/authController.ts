import {
  handleServiceResponse,
  validateReq,
} from '@/common/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import { Login_Req_Schema, Register_Req_Schema } from './authModel';
import { authService } from './authService';

export const register: RequestHandler = async (req: Request, res: Response) => {
  const { body } = validateReq(req, Register_Req_Schema);
  const serviceResponse = await authService.register(body);
  handleServiceResponse(serviceResponse, res);
};

export const login: RequestHandler = async (req: Request, res: Response) => {
  const { body } = validateReq(req, Login_Req_Schema);
  const serviceResponse = await authService.login(body);
  handleServiceResponse(serviceResponse, res);
};

export const logout: RequestHandler = async (_req: Request, res: Response) => {
  const serviceResponse = await authService.logout('id');
  handleServiceResponse(serviceResponse, res);
};

export const getCurrentUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId as string;
  const serviceResponse = await authService.getCurrentUser(userId);
  handleServiceResponse(serviceResponse, res);
};
