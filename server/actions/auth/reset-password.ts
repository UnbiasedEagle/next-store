'use server';

import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from '@/lib/validations/auth';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { sendPasswordResetEmail } from '@/server/lib/email';
import { generatePasswordResetToken } from '@/server/lib/tokens';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';

const action = createSafeActionClient();

export const resetPassword = action
  .inputSchema(ResetPasswordSchema)
  .action(async ({ parsedInput }: { parsedInput: ResetPasswordSchemaType }) => {
    const { email } = parsedInput;
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!existingUser) {
      return { error: 'User not found' };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    if (!passwordResetToken) {
      return { error: 'Token not generated' };
    }

    await sendPasswordResetEmail(email, passwordResetToken);

    return { success: 'Check your email for a link to reset your password.' };
  });
