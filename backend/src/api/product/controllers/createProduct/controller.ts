import { productRepo } from '@/db/repos/products/product.repo';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import { CreateProduct_Req_Schema, CreateProduct_ResBodyObj } from './model';

export const createProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { body } = validateReq(req, CreateProduct_Req_Schema);

  const userId = req.userId;
  if (!userId) throw new UnauthorizedError('User ID is required');

  const product = await productRepo.insertProduct({ ...body, user: userId });

  const serviceResponse = ServiceResponse.success<CreateProduct_ResBodyObj>(
    'Product created successfully',
    product
  );

  handleServiceResponse(serviceResponse, res);
};
