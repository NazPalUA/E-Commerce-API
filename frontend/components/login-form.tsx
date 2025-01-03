import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AuthCard } from './ui/auth-card';
import { Checkbox } from './ui/checkbox';
import { GoogleIcon } from './ui/icons';
import { InputGroup } from './ui/input-group';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
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
      <form>
        <div className="flex flex-col gap-6">
          <InputGroup
            label="Email"
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
          <InputGroup
            label="Password"
            id="password"
            type="password"
            placeholder="********"
            required
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
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            <GoogleIcon className="size-4" />
            Login with Google
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
