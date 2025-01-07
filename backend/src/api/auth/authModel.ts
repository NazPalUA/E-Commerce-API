import { User_DbEntity_Schema } from '@/common/db/repos/users/user.model';
import { commonValidations } from '@/common/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const UserToken_Schema = User_DbEntity_Schema.pick({
  name: true,
  email: true,
  role: true,
})
  .extend({
    id: commonValidations.id,
  })
  .strict();

export type UserToken = z.infer<typeof UserToken_Schema>;

// 'POST /auth/login' endpoint
export type Login_ReqBody = z.infer<typeof Login_ReqBody_Schema>;
export const Login_ReqBody_Schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

export const Login_Req_Schema = z.object({
  body: Login_ReqBody_Schema,
});

// 'POST /auth/register' endpoint
export type Register_ReqBody = z.infer<typeof Register_ReqBody_Schema>;
export const Register_ReqBody_Schema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

export const Register_Req_Schema = z.object({
  body: Register_ReqBody_Schema,
});

export type Register_ResObj = z.infer<typeof Register_ResObj_Schema>;
export const Register_ResObj_Schema = z.object({
  user: UserToken_Schema,
  token: z.string(),
});

// 'POST /auth/logout' endpoint
export const Logout_Req_Schema = z.object({});

// 'GET /auth/me' endpoint
export const Me_Req_Schema = z.object({});
