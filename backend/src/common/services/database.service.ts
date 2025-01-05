import { User_DbEntity } from '@/api/user/userModel';
import { env } from '@/common/utils/envConfig';
import { Collection, Db, MongoClient } from 'mongodb';
import { pino } from 'pino';

const logger = pino({ name: 'database-service' });

interface DatabaseCollections {
  users: Collection<User_DbEntity>;
}

// Initialize collections with a type assertion to avoid undefined
export const collections = {} as DatabaseCollections;

const client = new MongoClient(env.MONGODB_URI);

export async function connectDB(): Promise<Db> {
  try {
    await client.connect();
    logger.info('Connected to MongoDB');

    const db = client.db(env.DB_NAME);

    collections.users = db.collection<User_DbEntity>(env.USERS_COLLECTION);

    logger.info(`Successfully connected to database: ${db.databaseName}`);

    return db;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    logger.error('Please make sure MongoDB is running on your system');
    process.exit(1);
  }
}

export const db = client.db(env.DB_NAME);

export default client;
