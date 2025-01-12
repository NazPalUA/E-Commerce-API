import { Collection, ObjectId } from 'mongodb';
import { collections } from '../..';
import {
  getReviewDTO,
  NewReview,
  Review_DbEntity,
  Review_DbEntity_Schema,
  Review_DTO,
} from './review.model';

export class ReviewRepository {
  private get collection(): Collection<Review_DbEntity> {
    return collections.reviews;
  }

  public async isReviewOwner(
    reviewId: string,
    userId: string
  ): Promise<boolean> {
    const review = await this.collection.findOne(
      { _id: new ObjectId(reviewId) },
      { projection: { user: 1 } }
    );
    return review?.user.toString() === userId;
  }

  public async insertReview(review: NewReview): Promise<Review_DTO> {
    const candidate = Review_DbEntity_Schema.parse({
      ...review,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const result = await this.collection.insertOne(candidate);
    const reviewDTO = getReviewDTO({
      ...candidate,
      _id: result.insertedId,
    });
    return reviewDTO;
  }

  public async updateReview(
    reviewId: string,
    reviewData: Partial<
      Omit<Review_DTO, 'id' | 'createdAt' | 'user' | 'product'>
    >
  ): Promise<Review_DTO | null> {
    const updatedReview = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(reviewId) },
      { $set: { ...reviewData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    return updatedReview ? getReviewDTO(updatedReview) : null;
  }

  public async findAllReviews(): Promise<Review_DTO[]> {
    return this.collection
      .find()
      .toArray()
      .then(reviews => reviews.map(review => getReviewDTO(review)));
  }

  public async findReviewById(reviewId: string): Promise<Review_DTO | null> {
    return this.collection
      .findOne({ _id: new ObjectId(reviewId) })
      .then(review => (review ? getReviewDTO(review) : null));
  }

  public async findReviewsByUser(userId: string): Promise<Review_DTO[]> {
    return this.collection
      .find({ user: new ObjectId(userId) })
      .toArray()
      .then(reviews => reviews.map(review => getReviewDTO(review)));
  }

  public async findReviewsByProduct(productId: string): Promise<Review_DTO[]> {
    return this.collection
      .find({ product: new ObjectId(productId) })
      .toArray()
      .then(reviews => reviews.map(review => getReviewDTO(review)));
  }

  public async findReviewByUserAndProduct(
    userId: string,
    productId: string
  ): Promise<Review_DTO | null> {
    return this.collection
      .findOne({ user: new ObjectId(userId), product: new ObjectId(productId) })
      .then(review => (review ? getReviewDTO(review) : null));
  }

  public async deleteReview(reviewId: string): Promise<boolean> {
    const result = await this.collection.deleteOne({
      _id: new ObjectId(reviewId),
    });
    return result.deletedCount === 1;
  }
}

export const reviewRepo = new ReviewRepository();
