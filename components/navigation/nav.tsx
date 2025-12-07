import { auth } from '@/server/auth';
import { Logo } from './logo';
import { UserButton } from './user-button';
import { Button } from '../ui/button';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export const Nav = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <header className='py-8'>
      <nav>
        <ul className='flex justify-between items-center'>
          <li>
            <Logo />
          </li>
          {!user && (
            <li>
              <Button asChild>
                <Link href='/auth/login'>
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
              </Button>
            </li>
          )}
          {user && (
            <li>
              <UserButton user={user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
