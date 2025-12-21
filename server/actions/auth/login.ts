'use server';

import { LoginSchema, LoginSchemaType } from '@/lib/validations/auth';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { twoFactorTokens, users } from '@/server/db/schema';
import {
  generateTwoFactorToken,
  generateVerificationToken,
  getTwoFactorTokenByEmail,
} from '@/server/lib/tokens';
import {
  sendTwoFactorTokenByEmail,
  sendVerificationEmail,
} from '@/server/lib/email';
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

      if (existingUser.twoFactorEnabled && existingUser.email) {
        if (parsedInput.code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );
          if (!twoFactorToken) {
            return {
              error: 'Invalid code',
            };
          }
          if (twoFactorToken.token !== parsedInput.code) {
            return { error: 'Invalid Token' };
          }
          const hasExpired = new Date(twoFactorToken.expires) < new Date();
          if (hasExpired) {
            return { error: 'Token has expired' };
          }
          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          const token = await generateTwoFactorToken(existingUser.email);

          if (!token) {
            return { error: 'Token not generated!' };
          }

          await sendTwoFactorTokenByEmail(existingUser.email, token);
          return { twoFactor: 'Check your email for the 2FA code' };
        }
      }

      await signIn('credentials', {
        email: existingUser.email,
        password: parsedInput.password,
        redirectTo: '/',
      });

      return { success: 'Login successful' };
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'digest' in error &&
        typeof error.digest === 'string' &&
        error.digest.startsWith('NEXT_REDIRECT')
      ) {
        throw error;
      }

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
