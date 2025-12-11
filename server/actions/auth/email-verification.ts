'use server';

import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { users } from '@/server/db/schema';
import {
  getVerificationToken,
  deleteVerificationToken,
} from '@/server/lib/tokens';

export const verifyEmail = async (token: string) => {
  try {
    if (!token) {
      return {
        error: 'Missing token',
      };
    }

    const existingToken = await getVerificationToken(token);

    if (!existingToken) {
      return {
        error: 'Invalid token',
      };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return {
        error: 'Token has expired',
      };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });

    if (!existingUser) {
      return {
        error: 'Email does not exist',
      };
    }

    await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.id, existingUser.id));

    await deleteVerificationToken(existingToken.id);

    return {
      success: 'Email verified successfully',
    };
  } catch {
    return {
      error: 'Something went wrong',
    };
  }
};
