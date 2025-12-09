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
import { generateVerificationToken } from '@/server/lib/tokens';
import { sendVerificationEmail } from '@/server/lib/email';

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
