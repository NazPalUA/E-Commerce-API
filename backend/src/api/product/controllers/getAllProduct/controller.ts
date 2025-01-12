import { productRepo } from '@/db/repos/products/product.repo';
import { NotFoundError } from '@/errors/not-found-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import { GetAllProducts_ResBodyObj } from './model';

export const getAllProducts: RequestHandler = async (
  _req: Request,
  res: Response
) => {
  const products = await productRepo.findAllProducts();
  if (!products.length) {
    throw new NotFoundError('No Products');
  }

  const serviceResponse = ServiceResponse.success<GetAllProducts_ResBodyObj>(
    'Products retrieved successfully',
    products
  );

  handleServiceResponse(serviceResponse, res);
};
