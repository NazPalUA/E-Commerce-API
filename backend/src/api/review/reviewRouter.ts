import { Review_DTO_Schema } from '@/db/repos/reviews/review.model';
import { authenticate } from '@/middleware/authenticate';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { createReview } from './controllers/createReview/controller';
import { createReviewRouterConfig } from './controllers/createReview/docs-config';
import { deleteReview } from './controllers/deleteReview/controller';
import { deleteReviewRouterConfig } from './controllers/deleteReview/docs-config';
import { getAllReviews } from './controllers/getAllReviews/controller';
import { getAllReviewsRouterConfig } from './controllers/getAllReviews/docs-config';
import { getSingleReview } from './controllers/getSingleReview/controller';
import { getSingleReviewRouterConfig } from './controllers/getSingleReview/docs-config';
import { updateReview } from './controllers/updateReview/controller';
import { updateReviewRouterConfig } from './controllers/updateReview/docs-config';

export const reviewRegistry = new OpenAPIRegistry();
export const reviewRouter = Router();

reviewRegistry.register('Review', Review_DTO_Schema);

// Get all reviews (public)
reviewRouter.get('/', getAllReviews);
reviewRegistry.registerPath(getAllReviewsRouterConfig);

// Get single review (public)
reviewRouter.get('/:id', getSingleReview);
reviewRegistry.registerPath(getSingleReviewRouterConfig);

// Create review (authenticated)
reviewRouter.post('/', authenticate, createReview);
reviewRegistry.registerPath(createReviewRouterConfig);

// Delete review (authenticated)
reviewRouter.delete('/:id', authenticate, deleteReview);
reviewRegistry.registerPath(deleteReviewRouterConfig);

// Update review (authenticated)
reviewRouter.patch('/:id', authenticate, updateReview);
reviewRegistry.registerPath(updateReviewRouterConfig);
