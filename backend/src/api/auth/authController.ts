import { Request, RequestHandler, Response } from 'express';

import {
  handleServiceResponse,
  validateReq,
} from '@/common/utils/httpHandlers';
import { Login_Req_Schema, Register_Req_Schema } from './authModel';
import { authService } from './authService';

class AuthController {
  public register: RequestHandler = async (req: Request, res: Response) => {
    const { body } = validateReq(req, Register_Req_Schema);

    const serviceResponse = await authService.register(body);
    handleServiceResponse(serviceResponse, res);
  };

  public login: RequestHandler = async (req: Request, res: Response) => {
    const { body } = validateReq(req, Login_Req_Schema);

    const serviceResponse = await authService.login(body);
    handleServiceResponse(serviceResponse, res);
  };

  public logout: RequestHandler = async (_req: Request, res: Response) => {
    // Implement logout logic if necessary
    const serviceResponse = await authService.logout('id');
    handleServiceResponse(serviceResponse, res);
  };

  public getCurrentUser: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const userId = req.userId as string; // Ensure this is set by your auth middleware

    const serviceResponse = await authService.getCurrentUser(userId);
    handleServiceResponse(serviceResponse, res);
  };
}

export const authController = new AuthController();
