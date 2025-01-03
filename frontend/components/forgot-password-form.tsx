import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AuthCard } from './ui/auth-card';
import { InputGroup } from './ui/input-group';

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <AuthCard
      className={className}
      {...props}
      title="Reset password"
      description="Enter your email address and we'll send you a link to reset your password"
      footer={
        <>
          Remember your password?{' '}
          <Link href="/login" className="underline underline-offset-4">
            Back to login
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
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
