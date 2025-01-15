import { env } from '@/utils/envConfig';
import { Collection, Db, MongoClient } from 'mongodb';
import { Product_DbEntity } from './repos/products/product.model';
import { Review_DbEntity } from './repos/reviews/review.model';
import { Token_DbEntity } from './repos/token/token.model';
import { User_DbEntity } from './repos/users/user.model';

interface DatabaseCollections {
  users: Collection<User_DbEntity>;
  products: Collection<Product_DbEntity>;
  reviews: Collection<Review_DbEntity>;
  tokens: Collection<Token_DbEntity>;
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
    collections.tokens = db.collection<Token_DbEntity>(env.TOKENS_COLLECTION);

    // Create indexes
    await collections.users.createIndex({ email: 1 }, { unique: true });
    await collections.users.createIndex({ role: 1 });
    await collections.products.createIndex({ user: 1 });
    await collections.products.createIndex({ featured: 1 });
    await collections.products.createIndex({ category: 1 });
    await collections.products.createIndex({ company: 1 });
    await collections.reviews.createIndex({ user: 1 });
    await collections.reviews.createIndex({ product: 1 });
    // user may only leave one review per product
    await collections.reviews.createIndex(
      { user: 1, product: 1 },
      { unique: true }
    );
    await collections.tokens.createIndexes([
      { key: { user: 1 } },
      { key: { refreshToken: 1 }, unique: true },
      { key: { createdAt: 1 }, expireAfterSeconds: 60 * 60 * 24 * 7 }, // TTL index
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
