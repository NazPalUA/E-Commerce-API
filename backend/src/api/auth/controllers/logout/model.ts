import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'POST /auth/logout'

extendZodWithOpenApi(z);

// Request Schema
export type Logout_Req = z.infer<typeof Logout_Req_Schema>;
export const Logout_Req_Schema = z.object({
  body: z.null(),
});

// Response Schema
export type Logout_ResBodyObj = z.infer<typeof Logout_ResBodyObj_Schema>;
export const Logout_ResBodyObj_Schema = z.null();
