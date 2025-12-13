'use server';

import {
  NewPasswordSchema,
  NewPasswordSchemaType,
} from '@/lib/validations/auth';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { passwordResetTokens, users } from '@/server/db/schema';
import bcrypt from 'bcryptjs';
import { getPasswordResetToken } from '@/server/lib/tokens';

const actionClient = createSafeActionClient();

export const newPassword = actionClient
  .inputSchema(NewPasswordSchema)
  .action(async ({ parsedInput }: { parsedInput: NewPasswordSchemaType }) => {
    try {
      if (!parsedInput.token) {
        return {
          error: 'Missing token',
        };
      }

      const existingToken = await getPasswordResetToken(parsedInput.token);

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

      const hashedPassword = await bcrypt.hash(parsedInput.password, 10);

      await db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({ password: hashedPassword })
          .where(eq(users.id, existingUser.id));

        await tx
          .delete(passwordResetTokens)
          .where(eq(passwordResetTokens.id, existingToken.id));
      });

      return {
        success: 'Password reset successfully',
      };
    } catch {
      return {
        error: 'Something went wrong',
      };
    }
  });
