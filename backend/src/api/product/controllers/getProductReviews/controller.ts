import { productRepo } from '@/db/repos/products/product.repo';
import { reviewRepo } from '@/db/repos/reviews/review.repo';
import { NotFoundError } from '@/errors/not-found-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import {
  GetProductReviews_Req_Schema,
  GetProductReviews_ResBodyObj,
} from './model';

export const getProductReviews: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { params } = validateReq(req, GetProductReviews_Req_Schema);

  const productExists = await productRepo.checkProductExists(params.id);
  if (!productExists) throw new NotFoundError('Product not found');

  const reviews = await reviewRepo.findReviewsByProduct(params.id);

  const serviceResponse = ServiceResponse.success<GetProductReviews_ResBodyObj>(
    'Product reviews retrieved successfully',
    reviews
  );

  handleServiceResponse(serviceResponse, res);
};
