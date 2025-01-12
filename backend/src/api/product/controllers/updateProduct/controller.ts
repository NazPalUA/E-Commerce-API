import { productRepo } from '@/db/repos/products/product.repo';
import { ForbiddenError } from '@/errors/forbidden-error';
import { NotFoundError } from '@/errors/not-found-error';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import { UpdateProduct_Req_Schema, UpdateProduct_ResBodyObj } from './model';

export const updateProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { body, params } = validateReq(req, UpdateProduct_Req_Schema);

  const userId = req.userId;
  if (!userId) throw new UnauthorizedError('User ID is required');

  const isProductOwner = await productRepo.isProductOwner(params.id, userId);
  if (!isProductOwner)
    throw new ForbiddenError('You are not the owner of this product');

  const updatedProduct = await productRepo.updateProduct(params.id, body);
  if (!updatedProduct) throw new NotFoundError('Product not found');

  const serviceResponse = ServiceResponse.success<UpdateProduct_ResBodyObj>(
    'Product updated successfully',
    updatedProduct
  );

  handleServiceResponse(serviceResponse, res);
};
