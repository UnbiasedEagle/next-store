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
        return {
          error: 'User already exists',
        };
      }

      return {
        success: 'User registered',
      };
    } catch (error) {
      return {
        error: 'Something went wrong',
      };
    }
  });
