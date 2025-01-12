import { reviewRepo } from '@/db/repos/reviews/review.repo';
import { NotFoundError } from '@/errors/not-found-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import { GetAllReviews_ResBodyObj } from './model';

export const getAllReviews: RequestHandler = async (
  _req: Request,
  res: Response
) => {
  const reviews = await reviewRepo.findAllReviews();
  if (!reviews.length) {
    throw new NotFoundError('No Reviews');
  }

  const serviceResponse = ServiceResponse.success<GetAllReviews_ResBodyObj>(
    'Reviews retrieved successfully',
    reviews
  );

  handleServiceResponse(serviceResponse, res);
};
