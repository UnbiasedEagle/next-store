'use client';

import { FormError } from '@/components/auth/form-error';
import { FormSuccess } from '@/components/auth/form-success';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import { SettingsSchemaType } from '@/lib/validations/settings';
import { settings } from '@/server/actions/settings';
import { Session } from 'next-auth';
import { useAction } from 'next-safe-action/hooks';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SettingsCardProps {
  session: Session;
}

export const SettingsCard = ({ session }: SettingsCardProps) => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const form = useForm<SettingsSchemaType>({
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: session.user?.name ?? undefined,
      image: session.user?.image ?? undefined,
      isTwoFactorEnabled: session.user?.isTwoFactorEnabled ?? undefined,
      email: session.user?.email ?? undefined,
    },
  });

  const { status, execute } = useAction(settings, {
    onSuccess: ({ data }) => {
      if (data.success) {
        setSuccess(data.success);
        setTimeout(() => {
          setSuccess('');
          setError('');
        }, 3000);
      }
      if (data.error) {
        setError(data.error);
        setTimeout(() => {
          setSuccess('');
          setError('');
        }, 3000);
      }
    },
    onError() {
      setError('Something went wrong. Please try again.');
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
    },
  });

  const onSubmit = async (data: SettingsSchemaType) => {
    setSuccess('');
    setError('');
    execute(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={session.user?.name ?? 'Enter your name'}
                      disabled={status === 'executing'}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className='flex items-center gap-4'>
                    {!form.getValues('image') && (
                      <div className='w-9 h-9 rounded-full bg-linear-to-br from-primary/20 to-primary/40 text-primary font-semibold text-sm flex items-center justify-center shadow-sm'>
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues('image') && (
                      <Image
                        src={form.getValues('image')!}
                        width={36}
                        height={36}
                        className='rounded-full'
                        alt='User Image'
                      />
                    )}
                  </div>
                  <FormControl>
                    <Input
                      placeholder='User Image'
                      type='hidden'
                      disabled={status === 'executing'}
                      {...field}
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
                      placeholder='********'
                      disabled={status === 'executing' || session?.user.isOAuth}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='*******'
                      disabled={status === 'executing' || session?.user.isOAuth}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isTwoFactorEnabled'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormDescription>
                    Enable two factor authentication for your account
                  </FormDescription>
                  <FormControl>
                    <Switch
                      disabled={
                        status === 'executing' || session?.user.isOAuth === true
                      }
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type='submit' disabled={status === 'executing'}>
              Update your settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
