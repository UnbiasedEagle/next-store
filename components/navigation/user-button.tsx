'use client';

import { User } from 'next-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Settings, TruckIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface UserButtonProps {
  user: User;
}

export const UserButton = ({ user }: UserButtonProps) => {
  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className='h-7 w-7'>
          {user.image && <AvatarImage src={user.image} alt={user.name!} />}
          {!user.image && (
            <AvatarFallback className='bg-primary/25'>
              <div className='font-bold'>
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-64 p-6' align='end'>
        <div className='mb-4 p-4 flex flex-col gap-1 items-center rounded-lg  bg-primary/10'>
          {user.image && (
            <Image
              src={user.image}
              alt={user.name!}
              className='rounded-full'
              width={36}
              height={36}
            />
          )}
          <p className='font-bold text-xs'>{user.name}</p>
          <span className='text-xs font-medium text-secondary-foreground'>
            {user.email}
          </span>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => router.push('/dashboard/orders')}
          className='group py-2 font-medium cursor-pointer '
        >
          <TruckIcon
            size={14}
            className='mr-3 group-hover:translate-x-1 transition-all duration-300 ease-in-out'
          />{' '}
          My orders
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/dashboard/settings')}
          className='group py-2 font-medium cursor-pointer  ease-in-out '
        >
          <Settings
            size={14}
            className='mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out'
          />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut()}
          className='py-2 group focus:bg-destructive/30 font-medium cursor-pointer '
        >
          <LogOut
            size={14}
            className='mr-3  group-hover:scale-75 transition-all duration-300 ease-in-out'
          />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
