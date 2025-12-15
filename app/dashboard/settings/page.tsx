import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import { SettingsCard } from './settings-card';

const SettingsPage = async () => {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  return <SettingsCard session={session} />;
};

export default SettingsPage;
