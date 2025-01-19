'use server';

import { SignUpFormData, signUpSchema } from '../models/sign-up.schema';

export async function signUpAction(formData: SignUpFormData) {
  // Validate the input
  const result = signUpSchema.safeParse(formData);
  if (!result.success) {
    return { error: result.error.format() };
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result.data),
    }
  );

  return { success: response.ok };
}
