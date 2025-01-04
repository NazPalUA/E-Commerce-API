import { User } from '@/api/user/userModel';
import { env } from '@/common/utils/envConfig';
import { Collection, Db, MongoClient } from 'mongodb';

export const collections: { users?: Collection<User> } = {};

const client = new MongoClient(env.MONGODB_URI);

export async function connectDB(): Promise<Db> {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(env.DB_NAME);

    // Setup your collections
    const usersCollection = db.collection<User>(env.USERS_COLLECTION);
    collections.users = usersCollection;

    console.log(
      `Successfully connected to database: ${db.databaseName} 
       and collection: ${usersCollection.collectionName}`
    );

    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Please make sure MongoDB is running on your system');
    process.exit(1);
  }
}

export const db = client.db(env.DB_NAME);

export default client;
