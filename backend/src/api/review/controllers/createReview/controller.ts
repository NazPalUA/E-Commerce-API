import { productRepo } from '@/db/repos/products/product.repo';
import { reviewRepo } from '@/db/repos/reviews/review.repo';
import { NotFoundError } from '@/errors/not-found-error';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import { CreateReview_Req_Schema, CreateReview_ResBodyObj } from './model';

export const createReview: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { body } = validateReq(req, CreateReview_Req_Schema);
  const { productId, ...reviewData } = body;

  const userId = req.userId;
  if (!userId) throw new UnauthorizedError('User ID is required');

  const product = await productRepo.findProductById(productId);
  if (!product) throw new NotFoundError('Product not found');

  const review = await reviewRepo.insertReview({
    ...reviewData,
    user: userId,
    product: productId,
  });

  const serviceResponse = ServiceResponse.success<CreateReview_ResBodyObj>(
    'Review created successfully',
    review
  );

  handleServiceResponse(serviceResponse, res);
};
