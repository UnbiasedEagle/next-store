import { useForm } from 'react-hook-form';
import { AuthCard } from './auth-card';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginSchemaType } from '@/lib/validations/auth';
import { Form } from '@/components/ui/form';

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
        <form onSubmit={form.handleSubmit(onSubmit)}></form>
      </Form>
    </AuthCard>
  );
};
