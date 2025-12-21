'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { LoginSchema, LoginSchemaType } from '@/lib/validations/auth';
import { emailSignIn } from '@/server/actions/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthCard } from './auth-card';
import { FormError } from './form-error';
import { FormSuccess } from './form-success';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';

export const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      code: '',
    },
  });

  const { execute, status } = useAction(emailSignIn, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        setError(data.error);
      }
      if (data?.success) {
        setSuccess(data.success);
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
      if (data?.twoFactor) {
        setShowTwoFactor(true);
      }
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setError('');
    setSuccess('');
    execute(data);
  };

  return (
    <AuthCard
      cardTitle='Welcome back!'
      backButtonHref='/auth/register'
      backButtonLabel={showTwoFactor ? '' : "Don't have an account?"}
      showSocials={!showTwoFactor}
    >
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          {showTwoFactor && (
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem className='space-y-4'>
                  <FormLabel>
                    We&apos;ve sent you a two factor code to your email.
                  </FormLabel>
                  <FormControl>
                    <InputOTP
                      disabled={status === 'executing'}
                      {...field}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!showTwoFactor && (
            <>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter your email'
                          {...field}
                          type='email'
                          autoComplete='email'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter your password'
                          {...field}
                          type='password'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormSuccess message={success} />
                <FormError message={error} />
                <Button size='sm' variant='link' asChild>
                  <Link href='/auth/reset-password'>Forgot Password?</Link>
                </Button>
              </div>
              <Button
                disabled={status === 'executing'}
                className={cn(
                  'w-full',
                  status === 'executing' ? 'animate-pulse' : ''
                )}
                type='submit'
              >
                Login
              </Button>
            </>
          )}
        </form>
      </Form>
    </AuthCard>
  );
};
