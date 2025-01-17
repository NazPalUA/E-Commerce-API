import { openAPIRouter } from '@/api-docs/openAPIRouter';
import { authRouter } from '@/api/auth/authRouter';
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { userRouter } from '@/api/user/userRouter';
import errorHandler from '@/middleware/errorHandler';
import notFound from '@/middleware/not-found';
import rateLimiter from '@/middleware/rateLimiter';
import { env } from '@/utils/envConfig';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { productRouter } from './api/product/productRouter';
import { reviewRouter } from './api/review/reviewRouter';

const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);
app.use(cookieParser(env.JWT_SECRET));
// app.use(mongoSanitize());

// Request logging
app.use(morgan('dev'));

// Routes
app.use('/api/v1/health-check', healthCheckRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);

// Swagger UI
app.use('/api-docs/v1', openAPIRouter);

// Not found
app.use(notFound);

// Error handlers
app.use(errorHandler);

export { app };
