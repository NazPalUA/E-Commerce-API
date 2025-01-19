'use client';

import { Button } from '@/components/ui/button';
import { loginAction } from '@/lib/actions/login';
import { LoginFormData, loginSchema } from '@/lib/models/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AuthCard } from './ui/auth-card';
import { Checkbox } from './ui/checkbox';
import { GoogleIcon } from './ui/icons';
import { InputGroup } from './ui/input-group';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember: false,
    },
  });

  const router = useRouter();

  console.log(errors);

  const onSubmit = async (data: LoginFormData) => {
    console.log('data', data);
    try {
      const result = await loginAction(data);

      if (!result.success) {
        setError('root', {
          message: result.error || 'Login failed',
        });
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('root', {
        message: 'An unexpected error occurred',
      });
    }
  };

  return (
    <AuthCard
      className={className}
      {...props}
      title="Login"
      description="Enter your email below to login to your account"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          {errors.root && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
              {errors.root.message}
            </div>
          )}
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
            placeholder="********"
            error={errors.password?.message}
            {...register('password')}
            action={
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            }
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              onCheckedChange={checked => {
                register('remember').onChange({
                  target: { name: 'remember', value: checked },
                });
              }}
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            type="button"
            disabled={isSubmitting}
          >
            <GoogleIcon className="size-4" />
            Login with Google
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
