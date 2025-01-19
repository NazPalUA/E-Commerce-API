'use server';

import { LoginFormData, loginSchema } from '../models/login.schema';

export async function loginAction(formData: LoginFormData) {
  try {
    // Validate the input
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      return { success: false, error: 'Invalid form data' };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result.data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to login',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
