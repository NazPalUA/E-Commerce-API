import { env } from '@/utils/envConfig';
import { Collection, Db, MongoClient } from 'mongodb';
import { pino } from 'pino';
import { User_DbEntity } from './repos/users/user.model';

const logger = pino({ name: 'database-service' });

interface DatabaseCollections {
  users: Collection<User_DbEntity>;
}

export const collections = {} as DatabaseCollections;

const client = new MongoClient(env.MONGODB_URI);

export async function connectDB(): Promise<Db> {
  try {
    await client.connect();
    logger.info('Connected to MongoDB');

    const db = client.db(env.DB_NAME);

    // Initialize collections
    collections.users = db.collection<User_DbEntity>(env.USERS_COLLECTION);

    // Create indexes
    await collections.users.createIndex({ email: 1 }, { unique: true });
    await collections.users.createIndex({ role: 1 });

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
