import { AuthCard } from './auth-card';

export const LoginForm = () => {
  return (
    <AuthCard
      cardTitle='Welcome back!'
      backButtonHref='/auth/register'
      backButtonLabel="Don't have an account?"
      showSocials
    >
      <div>Hey</div>
    </AuthCard>
  );
};
