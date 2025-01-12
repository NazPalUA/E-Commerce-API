import { env } from '@/utils/envConfig';
import { Collection, Db, MongoClient } from 'mongodb';
import { Product_DbEntity } from './repos/products/product.model';
import { User_DbEntity } from './repos/users/user.model';

interface DatabaseCollections {
  users: Collection<User_DbEntity>;
  products: Collection<Product_DbEntity>;
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

    // Create indexes
    await collections.users.createIndex({ email: 1 }, { unique: true });
    await collections.users.createIndex({ role: 1 });
    await collections.products.createIndex({ user: 1 });
    await collections.products.createIndex({ featured: 1 });
    await collections.products.createIndex({ category: 1 });
    await collections.products.createIndex({ company: 1 });

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
