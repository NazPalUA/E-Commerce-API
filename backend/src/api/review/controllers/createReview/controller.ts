import client from '@/db';
import { productRepo } from '@/db/repos/products/product.repo';
import { reviewRepo } from '@/db/repos/reviews/review.repo';
import { BadRequestError } from '@/errors/bad-request-error';
import { NotFoundError } from '@/errors/not-found-error';
import { InternalServerError } from '@/errors/server-error';
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

  const alreadyReviewed = await reviewRepo.findReviewByUserAndProduct(
    userId,
    productId
  );
  if (alreadyReviewed)
    throw new BadRequestError('User already reviewed this product');

  const session = client.startSession();

  try {
    const review = await session.withTransaction(async () => {
      return await reviewRepo.insertReview(
        {
          ...reviewData,
          user: userId,
          product: productId,
        },
        session
      );
    });

    const serviceResponse = ServiceResponse.success<CreateReview_ResBodyObj>(
      'Review created successfully and average rating updated',
      review
    );

    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    console.error('Error creating review:', error);
    throw new InternalServerError('Failed to create review');
  } finally {
    await session.endSession();
  }
};
