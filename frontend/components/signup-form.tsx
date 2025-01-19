'use client';

import { Button } from '@/components/ui/button';
import { signUpAction } from '@/lib/actions/signup';
import { SignUpFormData, signUpSchema } from '@/lib/models/sign-up.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { GoogleIcon } from './ui/icons';
import { InputGroup } from './ui/input-group';
export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: SignUpFormData) => {
    signUpAction(data);
    router.push('/verify-email');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <InputGroup
          label="Full Name"
          id="name"
          type="text"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name')}
        />
        <InputGroup
          label="Email"
          id="email"
          type="email"
          placeholder="m@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <InputGroup
          label="Password"
          id="password"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        <InputGroup
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
        <Button variant="outline" className="w-full" type="button">
          <GoogleIcon className="size-4" />
          Sign up with Google
        </Button>
      </div>
    </form>
  );
}
