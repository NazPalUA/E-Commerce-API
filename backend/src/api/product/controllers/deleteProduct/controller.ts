import { productRepo } from '@/db/repos/product/product.repo';
import { ForbiddenError } from '@/errors/forbidden-error';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import { DeleteProduct_Req_Schema, DeleteProduct_ResBodyObj } from './model';

export const deleteProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { params } = validateReq(req, DeleteProduct_Req_Schema);

  const userId = req.userId;
  if (!userId) throw new UnauthorizedError('User ID is required');

  const isProductOwner = await productRepo.isProductOwner(params.id, userId);
  if (!isProductOwner)
    throw new ForbiddenError('You are not the owner of this product');

  await productRepo.deleteProduct(params.id);

  const serviceResponse = ServiceResponse.success<DeleteProduct_ResBodyObj>(
    'Product deleted successfully',
    { deleted: true }
  );

  handleServiceResponse(serviceResponse, res);
};
