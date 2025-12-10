'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { AuthCard } from './auth-card';
import { useCallback, useEffect, useState } from 'react';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';
import { verifyEmail } from '@/server/actions/auth';

export const EmailVerificationForm = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleVerification = useCallback(async () => {
    if (!token) {
      setError('Missing verification token');
      setIsLoading(false);
      return;
    }

    try {
      const result = await verifyEmail(token);

      if (result.error) {
        setError(result.error);
      }

      if (result.success) {
        setSuccess(result.success);
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [token, router]);

  useEffect(() => {
    handleVerification();
  }, [handleVerification]);

  return (
    <AuthCard
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'
      cardTitle='Verify your account'
    >
      <div className='flex items-center flex-col w-full justify-center gap-2'>
        {isLoading && (
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
            <p className='text-sm text-muted-foreground'>
              Verifying your email...
            </p>
          </div>
        )}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
  );
};
