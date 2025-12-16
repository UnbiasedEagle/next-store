'use server';

import { SettingsSchema } from '@/lib/validations/settings';
import { createSafeActionClient } from 'next-safe-action';
import { auth } from '../auth';
import { db } from '../db';
import bcrypt from 'bcryptjs';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const action = createSafeActionClient();

export const settings = action
  .inputSchema(SettingsSchema)
  .action(async ({ parsedInput: values }) => {
    const session = await auth();
    if (!session?.user) {
      return {
        error: 'User not found',
      };
    }

    const dbUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session.user.id),
    });

    if (!dbUser) {
      return {
        error: 'User not found',
      };
    }

    if (session.user.isOAuth) {
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
      values.isTwoFactorEnabled = undefined;
    }

    if (values.password && values.newPassword && dbUser.password) {
      const passwordMatch = await bcrypt.compare(
        values.password,
        dbUser.password
      );
      if (!passwordMatch) {
        return {
          error: 'Incorrect password',
        };
      }
      const samePassword = await bcrypt.compare(
        values.newPassword,
        dbUser.password
      );
      if (samePassword) {
        return {
          error: 'New password must be different from the old password',
        };
      }
      const hashedPassword = await bcrypt.hash(values.newPassword, 12);
      values.password = hashedPassword;
      values.newPassword = undefined;
    }

    await db
      .update(users)
      .set({
        twoFactorEnabled: values.isTwoFactorEnabled,
        name: values.name,
        image: values.image,
        email: values.email,
        password: values.password,
      })
      .where(eq(users.id, dbUser.id));
    revalidatePath('/dashboard/settings');
    return {
      success: 'Settings updated',
    };
  });
