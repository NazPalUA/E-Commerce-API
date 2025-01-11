import { productRepo } from '@/db/repos/product/product.repo';
import { NotFoundError } from '@/errors/not-found-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import {
  GetSingleProduct_Req_Schema,
  GetSingleProduct_ResBodyObj,
} from './model';

export const getSingleProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { params } = validateReq(req, GetSingleProduct_Req_Schema);

  const product = await productRepo.findProductById(params.id);
  if (!product) throw new NotFoundError('Product not found');

  const serviceResponse = ServiceResponse.success<GetSingleProduct_ResBodyObj>(
    'Product retrieved successfully',
    product
  );

  handleServiceResponse(serviceResponse, res);
};
