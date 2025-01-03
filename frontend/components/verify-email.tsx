import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AuthCard } from './ui/auth-card';

export function VerifyEmailForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <AuthCard
      className={className}
      {...props}
      title="Verify your email"
      description="We've sent you a verification link to your email address"
      footer={
        <Link href="/login" className="underline underline-offset-4">
          Back to login
        </Link>
      }
    >
      <div className="flex flex-col gap-6">
        <p className="text-sm text-muted-foreground">
          Please check your email and click the verification link to complete
          your registration. If you haven&apos;t received the email, you can
          request a new one.
        </p>
        <Button variant="outline" className="w-full">
          Resend verification email
        </Button>
      </div>
    </AuthCard>
  );
}
