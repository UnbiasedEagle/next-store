import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import {
  passwordResetTokens,
  twoFactorTokens,
  verificationTokens,
} from '@/server/db/schema';
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

export const getVerificationToken = async (token: string) => {
  const verificationToken = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.token, token),
  });

  return verificationToken;
};

export const deleteVerificationToken = async (id: string) => {
  await db.delete(verificationTokens).where(eq(verificationTokens.id, id));
};

export const getPasswordResetToken = async (token: string) => {
  const passwordResetToken = await db.query.passwordResetTokens.findFirst({
    where: eq(passwordResetTokens.token, token),
  });

  return passwordResetToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 3600 * 1000);

  const existingToken = await db.query.passwordResetTokens.findFirst({
    where: eq(passwordResetTokens.email, email),
  });

  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));
  }

  await db.insert(passwordResetTokens).values({
    token,
    expires,
    email,
  });

  return token;
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  const twoFactorToken = await db.query.twoFactorTokens.findFirst({
    where: eq(twoFactorTokens.email, email),
  });

  return twoFactorToken;
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(Date.now() + 3600 * 1000);

  const existingToken = await db.query.twoFactorTokens.findFirst({
    where: eq(twoFactorTokens.email, email),
  });

  if (existingToken) {
    await db
      .delete(twoFactorTokens)
      .where(eq(twoFactorTokens.id, existingToken.id));
  }

  await db.insert(twoFactorTokens).values({
    token,
    expires,
    email,
  });

  return token;
};
