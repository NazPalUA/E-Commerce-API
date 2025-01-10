import { User_DTO_Schema } from '@/db/repos/users/user.model';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'GET /users/me'

extendZodWithOpenApi(z);

// Request Schema

// Response Schema
export type GetMe_ResBodyObj = z.infer<typeof GetMe_ResBodyObj_Schema>;
export const GetMe_ResBodyObj_Schema = User_DTO_Schema;
