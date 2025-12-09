import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { verificationTokens } from '@/server/db/schema';
import crypto from 'crypto';

export const generateVerificationToken = async (email: string) => {
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
