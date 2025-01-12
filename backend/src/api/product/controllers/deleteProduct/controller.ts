import client from '@/db';
import { productRepo } from '@/db/repos/products/product.repo';
import { reviewRepo } from '@/db/repos/reviews/review.repo';
import { ForbiddenError } from '@/errors/forbidden-error';
import { InternalServerError } from '@/errors/server-error';
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

  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      const productDeleted = await productRepo.deleteProduct(
        params.id,
        session
      );
      if (!productDeleted)
        throw new InternalServerError('Failed to delete product');

      await reviewRepo.deleteReviewsByProduct(params.id, session);
    });

    const serviceResponse = ServiceResponse.success<DeleteProduct_ResBodyObj>(
      'Product and associated reviews deleted successfully',
      { deleted: true }
    );

    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    throw new InternalServerError('Failed to delete product');
  } finally {
    await session.endSession();
  }
};
