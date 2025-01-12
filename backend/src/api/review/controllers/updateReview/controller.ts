import { reviewRepo } from '@/db/repos/reviews/review.repo';
import { ForbiddenError } from '@/errors/forbidden-error';
import { NotFoundError } from '@/errors/not-found-error';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import { UpdateReview_Req_Schema, UpdateReview_ResBodyObj } from './model';

export const updateReview: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { body, params } = validateReq(req, UpdateReview_Req_Schema);

  const userId = req.userId;
  if (!userId) throw new UnauthorizedError('User ID is required');

  const isReviewOwner = await reviewRepo.isReviewOwner(params.id, userId);
  if (!isReviewOwner)
    throw new ForbiddenError('You are not the owner of this review');

  const updatedReview = await reviewRepo.updateReview(params.id, body);
  if (!updatedReview) throw new NotFoundError('Review not found');

  const serviceResponse = ServiceResponse.success<UpdateReview_ResBodyObj>(
    'Review updated successfully',
    updatedReview
  );

  handleServiceResponse(serviceResponse, res);
};
