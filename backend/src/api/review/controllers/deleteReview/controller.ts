import { reviewRepo } from '@/db/repos/reviews/review.repo';
import { UserRoles } from '@/db/repos/users/constants';
import { ForbiddenError } from '@/errors/forbidden-error';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ServiceResponse } from '@/models/serviceResponse';
import { handleServiceResponse, validateReq } from '@/utils/httpHandlers';
import { Request, RequestHandler, Response } from 'express';
import { DeleteReview_Req_Schema, DeleteReview_ResBodyObj } from './model';

export const deleteReview: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { params } = validateReq(req, DeleteReview_Req_Schema);

  const userId = req.userId;
  if (!userId) throw new UnauthorizedError('User ID is required');

  const isAdmin = req.userRole === UserRoles.ADMIN;
  const isReviewOwner = await reviewRepo.isReviewOwner(params.id, userId);
  if (!isReviewOwner && !isAdmin)
    throw new ForbiddenError('Only admins or review owner can delete review');

  await reviewRepo.deleteReview(params.id);

  const serviceResponse = ServiceResponse.success<DeleteReview_ResBodyObj>(
    'Review deleted successfully',
    { deleted: true }
  );

  handleServiceResponse(serviceResponse, res);
};
