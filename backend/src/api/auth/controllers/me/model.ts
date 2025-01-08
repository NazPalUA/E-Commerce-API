import { TokenPayload_Schema } from '@/common/utils/jwt';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 'GET /auth/me' endpoint

extendZodWithOpenApi(z);

// Request Schema
export const Me_Req_Schema = z.object({
  body: z.null(),
});

// Response Schema
export type Me_ResBodyObj = z.infer<typeof Me_ResBodyObj_Schema>;
export const Me_ResBodyObj_Schema = TokenPayload_Schema;
