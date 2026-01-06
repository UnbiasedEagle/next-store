import { auth } from '@/server/auth';
import { Logo } from './logo';
import { UserButton } from './user-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { CartDrawer } from '../cart/cart-drawer';

export const Nav = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <header className='py-4'>
      <nav>
        <ul className='flex justify-between items-center md:gap-8 gap-4'>
          <li className='flex flex-1 items-center'>
            <Link href='/' aria-label='Next Store'>
              <Logo />
            </Link>
          </li>
          <li className='relative flex items-center hover:bg-muted'>
            <CartDrawer />
          </li>
          {!user && (
            <li className='flex items-center'>
              <Button asChild>
                <Link href='/auth/login'>
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          )}
          {user && (
            <li className='flex items-center'>
              <UserButton user={user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
