import { env } from '@/utils/envConfig';
import { Collection, Db, MongoClient } from 'mongodb';
import { Product_DbEntity } from './repos/products/product.model';
import { RefreshRefreshToken_DbEntity } from './repos/refreshToken/refreshToken.model';
import { Review_DbEntity } from './repos/reviews/review.model';
import { User_DbEntity } from './repos/users/user.model';

interface DatabaseCollections {
  users: Collection<User_DbEntity>;
  products: Collection<Product_DbEntity>;
  reviews: Collection<Review_DbEntity>;
  refreshTokens: Collection<RefreshRefreshToken_DbEntity>;
}

export const collections = {} as DatabaseCollections;

const client = new MongoClient(env.MONGODB_URI);

export async function connectDB(): Promise<Db> {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(env.DB_NAME);

    // Initialize collections
    collections.users = db.collection<User_DbEntity>(env.USERS_COLLECTION);
    collections.products = db.collection<Product_DbEntity>(
      env.PRODUCTS_COLLECTION
    );
    collections.reviews = db.collection<Review_DbEntity>(
      env.REVIEWS_COLLECTION
    );
    collections.refreshTokens = db.collection<RefreshRefreshToken_DbEntity>(
      env.TOKENS_COLLECTION
    );

    // Create indexes
    await Promise.all([
      // User indexes
      collections.users.createIndexes([
        { key: { email: 1 }, unique: true },
        { key: { role: 1 } },
      ]),

      // Product indexes
      collections.products.createIndexes([
        { key: { user: 1 } },
        { key: { featured: 1 } },
        { key: { category: 1 } },
        { key: { company: 1 } },
      ]),

      // Review indexes
      collections.reviews.createIndexes([
        { key: { user: 1 } },
        { key: { product: 1 } },
        { key: { user: 1, product: 1 }, unique: true }, // User may only leave one review per product
      ]),

      // Token indexes
      collections.refreshTokens.createIndexes([
        { key: { refreshToken: 1 }, unique: true },
        { key: { user: 1 } },
        {
          key: { createdAt: 1 },
          expireAfterSeconds: 60 * 60 * 24 * env.REFRESH_TOKEN_TTL_DAYS,
        }, // 30 days TTL
        { key: { isValid: 1 } },
      ]),
    ]);

    console.log(`Successfully connected to database: ${db.databaseName}`);

    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Please make sure MongoDB is running on your system');
    process.exit(1);
  }
}

export const db = client.db(env.DB_NAME);

export default client;
