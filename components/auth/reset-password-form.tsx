'use client';

import { AuthCard } from './auth-card';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { ResetPasswordSchemaType } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordSchema } from '@/lib/validations/auth';
import { Input } from '../ui/input';
import { useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAction } from 'next-safe-action/hooks';
import { resetPassword } from '@/server/actions/auth';

export const ResetPasswordForm = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { execute, status } = useAction(resetPassword, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        setError(data.error);
      }
      if (data?.success) {
        setSuccess(data.success);
      }
    },
  });

  const onSubmit = (values: ResetPasswordSchemaType) => {
    execute({ email: values.email });
  };

  return (
    <AuthCard
      cardTitle='Forgot your password? '
      backButtonHref='/auth/login'
      backButtonLabel='Back to login'
      showSocials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='developedbyed@gmail.com'
                        type='email'
                        disabled={status === 'executing'}
                        autoComplete='email'
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button size={'sm'} variant={'link'} asChild>
                <Link href='/auth/reset'>Forgot your password</Link>
              </Button>
            </div>
            <Button
              disabled={status === 'executing'}
              type='submit'
              className={cn(
                'w-full',
                status === 'executing' ? 'animate-pulse' : ''
              )}
            >
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};
