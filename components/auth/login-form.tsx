'use client';

import { useForm } from 'react-hook-form';
import { AuthCard } from './auth-card';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginSchemaType } from '@/lib/validations/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';

export const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    console.log(data);
  };

  return (
    <AuthCard
      cardTitle='Welcome back!'
      backButtonHref='/auth/register'
      backButtonLabel="Don't have an account?"
      showSocials
    >
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
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
                      autoComplete='password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button size='sm' variant='link' asChild>
              <Link href='/auth/reset'>Forgot Password?</Link>
            </Button>
          </div>
          <Button className='w-full' type='submit'>
            Login
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
