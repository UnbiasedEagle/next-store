'use client';

import { RegisterSchema, RegisterSchemaType } from '@/lib/validations/auth';
import { AuthCard } from './auth-card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { emailRegister } from '@/server/actions/auth';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';

export const RegisterForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const { execute, status } = useAction(emailRegister, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        setError(data.error);
      }
      if (data?.success) {
        setSuccess(data.success);
      }
    },
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    setError('');
    setSuccess('');
    execute(data);
  };

  return (
    <AuthCard
      cardTitle='Create an account 🎉'
      backButtonHref='/auth/login'
      backButtonLabel='Already have an account?'
      showSocials
    >
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your name'
                      {...field}
                      type='text'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          </div>
          <Button
            disabled={status === 'executing'}
            className={cn(
              'w-full',
              status === 'executing' ? 'animate-pulse' : ''
            )}
            type='submit'
          >
            Register
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
