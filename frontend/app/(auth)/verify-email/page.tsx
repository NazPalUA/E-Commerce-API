import { VerifyEmailForm } from '@/components/verify-email';
import { redirect } from 'next/navigation';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { verificationToken?: string; email?: string };
}) {
  if (!searchParams.verificationToken || !searchParams.email)
    return <VerifyEmailForm />;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        verificationToken: searchParams.verificationToken,
        email: searchParams.email,
      }),
    }
  );

  if (response.ok) redirect('/login');

  return <VerifyEmailForm />;
}
