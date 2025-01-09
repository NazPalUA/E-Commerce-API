import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'POST /auth/logout'

extendZodWithOpenApi(z);

// Request Schema

// Response Schema
export type Logout_ResBodyObj = z.infer<typeof Logout_ResBodyObj_Schema>;
export const Logout_ResBodyObj_Schema = z.null();
