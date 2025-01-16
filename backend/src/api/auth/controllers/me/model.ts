import { AccessJWTPayload_Schema } from '@/models/AccessToken';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'GET /auth/me' endpoint

extendZodWithOpenApi(z);

// Request Schema

// Response Schema
export type Me_ResBodyObj = z.infer<typeof Me_ResBodyObj_Schema>;
export const Me_ResBodyObj_Schema = AccessJWTPayload_Schema;
