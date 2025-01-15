import dotenv from 'dotenv';
import { bool, cleanEnv, host, num, port, str, testOnly } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly('test'),
    choices: ['development', 'production', 'test'],
  }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  MONGODB_URI: str(),
  DB_NAME: str({ default: 'someDefaultDbName' }),
  USERS_COLLECTION: str({ default: 'users' }),
  PRODUCTS_COLLECTION: str({ default: 'products' }),
  REVIEWS_COLLECTION: str({ default: 'reviews' }),
  ORDERS_COLLECTION: str({ default: 'orders' }),
  JWT_SECRET: str(),
  JWT_LIFETIME: str({ default: '1h' }),

  EMAIL_HOST: str({ default: 'smtp.ethereal.email' }),
  EMAIL_PORT: num({ default: 587 }),
  EMAIL_SECURE: bool({ default: false }),
  EMAIL_USER: str(),
  EMAIL_PASSWORD: str(),
  EMAIL_FROM_NAME: str({ default: 'E-Commerce API' }),
  EMAIL_FROM_EMAIL: str(),
  FRONTEND_URL: str({ default: 'http://localhost:3000' }),
});
