import { SignUpForm } from '@/components/signup-form';
import { AuthCard } from '@/components/ui/auth-card';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <AuthCard
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
      <SignUpForm />
    </AuthCard>
  );
}
