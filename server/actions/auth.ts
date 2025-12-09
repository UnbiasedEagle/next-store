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
import { users, verificationTokens } from '@/server/db/schema';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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
          error: 'User not found',
        };
      }

      return {
        success: 'User found',
      };
    } catch (error) {
      return {
        error: 'Something went wrong',
      };
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

      return {
        success: 'Email confirmation sent',
      };
    } catch (error) {
      return {
        error: 'Something went wrong',
      };
    }
  });

const generateVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 3600 * 1000);

  const existingToken = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.email, email),
  });

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id));
  }

  await db.insert(verificationTokens).values({
    token,
    expires,
    email,
  });

  return token;
};
