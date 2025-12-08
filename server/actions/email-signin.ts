'use server';

import { LoginSchema, LoginSchemaType } from '@/lib/validations/auth';
import { createSafeActionClient } from 'next-safe-action';

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
  .inputSchema(LoginSchema)
  .action(async ({ parsedInput }: { parsedInput: LoginSchemaType }) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return {
      success: true,
      data: parsedInput,
    };
  });
