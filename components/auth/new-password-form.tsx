'use client';

import { AuthCard } from './auth-card';
import { useForm } from 'react-hook-form';
import {
  NewPasswordSchema,
  NewPasswordSchemaType,
} from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { newPassword } from '@/server/actions/auth';

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const form = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const { execute, status } = useAction(newPassword, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        setError(data.error);
      }
      if (data?.success) {
        setSuccess(data.success);
      }
    },
  });

  const onSubmit = (values: NewPasswordSchemaType) => {
    setError('');
    setSuccess('');
    execute({
      token: token!,
      password: values.password,
    });
  };

  return (
    <AuthCard
      cardTitle='Enter a new password'
      backButtonHref='/auth/login'
      backButtonLabel='Back to login'
    >
      <div>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Enter your new password'
                        type='password'
                        autoComplete='current-password'
                        disabled={status === 'executing'}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccess message={success} />
              <FormError message={error} />
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
