'use server';

import { LoginSchema, LoginSchemaType } from '@/lib/validations/auth';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { users } from '@/server/db/schema';
import { generateVerificationToken } from '@/server/lib/tokens';
import { sendVerificationEmail } from '@/server/lib/email';
import { signIn } from '../../auth';
import { AuthError } from 'next-auth';

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
  .inputSchema(LoginSchema)
  .action(async ({ parsedInput }: { parsedInput: LoginSchemaType }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, parsedInput.email),
      });

      if (!existingUser) {
        return {
          error: 'Email not found',
        };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
          existingUser.email
        );
        await sendVerificationEmail(existingUser.email, verificationToken);
        return {
          success: 'Email confirmation sent',
        };
      }

      await signIn('credentials', {
        email: existingUser.email,
        password: parsedInput.password,
        redirectTo: '/',
      });

      return { success: 'Login successful' };
    } catch (error) {
      console.log(error);
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return { error: 'Email or Password Incorrect' };
          case 'AccessDenied':
            return { error: error.message };
          case 'OAuthSignInError':
            return { error: error.message };
          default:
            return { error: 'Something went wrong' };
        }
      }
      throw error;
    }
  });
