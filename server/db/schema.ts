import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  serial,
  real,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from '@auth/core/adapters';
import { createId } from '@paralleldrive/cuid2';

export const RoleEnum = pgEnum('roles', ['user', 'admin']);

export const users = pgTable('user', {
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').unique().notNull(),
  password: text('password'),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  twoFactorEnabled: boolean('twoFactorEnabled').default(false),
  role: RoleEnum('roles').default('user'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const verificationTokens = pgTable(
  'verificationToken',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  ]
);

export const passwordResetTokens = pgTable(
  'passwordResetToken',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
  },
  (passwordResetToken) => [
    primaryKey({
      columns: [passwordResetToken.id, passwordResetToken.token],
    }),
  ]
);

export const twoFactorTokens = pgTable(
  'twoFactorToken',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
  },
  (twoFactorToken) => [
    primaryKey({
      columns: [twoFactorToken.id, twoFactorToken.token],
    }),
  ]
);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  description: text('description').notNull(),
  title: text('title').notNull(),
  created: timestamp('created').defaultNow(),
  price: real('price').notNull(),
});
