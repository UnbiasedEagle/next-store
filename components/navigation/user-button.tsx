'use client';

import { User } from 'next-auth';
import { signOut } from 'next-auth/react';

interface UserButtonProps {
  user: User;
}

export const UserButton = ({ user }: UserButtonProps) => {
  return (
    <div>
      <h1>{user?.email}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};
