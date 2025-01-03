import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AuthCard } from './ui/auth-card';
import { InputGroup } from './ui/input-group';

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <AuthCard
      className={className}
      {...props}
      title="Create an account"
      description="Enter your details below to create your account"
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="underline underline-offset-4">
            Login
          </Link>
        </>
      }
    >
      <form>
        <div className="flex flex-col gap-6">
          <InputGroup
            label="Full Name"
            id="name"
            type="text"
            placeholder="John Doe"
            required
          />
          <InputGroup
            label="Email"
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
          <InputGroup label="Password" id="password" type="password" required />
          <InputGroup
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            required
          />
          <Button type="submit" className="w-full">
            Create account
          </Button>
          <Button variant="outline" className="w-full">
            Sign up with Google
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
