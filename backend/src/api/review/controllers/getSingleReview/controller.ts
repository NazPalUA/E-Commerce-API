import { reviewRepo } from '@/db/repos/reviews/review.repo';
import { NotFoundError } from '@/errors/not-found-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import {
  GetSingleReview_Req_Schema,
  GetSingleReview_ResBodyObj,
} from './model';

export const getSingleReview: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { params } = validateReq(req, GetSingleReview_Req_Schema);

  const review = await reviewRepo.findReviewById(params.id);
  if (!review) throw new NotFoundError('Review not found');

  const serviceResponse = ServiceResponse.success<GetSingleReview_ResBodyObj>(
    'Review retrieved successfully',
    review
  );

  handleServiceResponse(serviceResponse, res);
};
