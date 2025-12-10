'use server';

import {
  LoginSchema,
  LoginSchemaType,
  RegisterSchema,
  RegisterSchemaType,
} from '@/lib/validations/auth';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { users } from '@/server/db/schema';
import bcrypt from 'bcryptjs';
import {
  generateVerificationToken,
  getVerificationToken,
  deleteVerificationToken,
} from '@/server/lib/tokens';
import { sendVerificationEmail } from '@/server/lib/email';
import { signIn } from '../auth';
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
        redirect: false,
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
      return { error: 'Something went wrong' };
    }
  });

export const emailRegister = actionClient
  .inputSchema(RegisterSchema)
  .action(async ({ parsedInput }: { parsedInput: RegisterSchemaType }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, parsedInput.email),
      });

      if (existingUser) {
        if (!existingUser.emailVerified) {
          const verificationToken = await generateVerificationToken(
            existingUser.email
          );
          await sendVerificationEmail(existingUser.email, verificationToken);
          return {
            success: 'Email confirmation sent',
          };
        }
        return {
          error: 'User already exists',
        };
      }

      const hashedPassword = await bcrypt.hash(parsedInput.password, 10);

      await db.insert(users).values({
        email: parsedInput.email,
        name: parsedInput.name,
        password: hashedPassword,
      });

      const verificationToken = await generateVerificationToken(
        parsedInput.email
      );
      await sendVerificationEmail(parsedInput.email, verificationToken);

      return {
        success: 'Email confirmation sent',
      };
    } catch (error) {
      return {
        error: 'Something went wrong',
      };
    }
  });

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
  } catch (error) {
    return {
      error: 'Something went wrong',
    };
  }
};
