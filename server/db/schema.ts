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
  index,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from '@auth/core/adapters';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';

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

export const productVariants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  color: text('color').notNull(),
  productType: text('product_type').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  productId: serial('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
});

export const variantImages = pgTable('variant_images', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  size: real('size').notNull(),
  name: text('name').notNull(),
  order: integer('order').notNull(),
  variantId: serial('variant_id')
    .notNull()
    .references(() => productVariants.id, { onDelete: 'cascade' }),
});

export const variantTags = pgTable('variant_tags', {
  variantId: serial('variant_id')
    .notNull()
    .references(() => productVariants.id, { onDelete: 'cascade' }),
  tag: text('tag').notNull(),
});

export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants, { relationName: 'ProductToVariants' }),
  reviews: many(reviews, { relationName: 'ProductToReviews' }),
}));

export const productVariantRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
      relationName: 'ProductToVariants',
    }),
    variantImages: many(variantImages, {
      relationName: 'VariantToImages',
    }),
    variantTags: many(variantTags, { relationName: 'VariantToTags' }),
  })
);

export const variantImageRelations = relations(variantImages, ({ one }) => ({
  productVariant: one(productVariants, {
    fields: [variantImages.variantId],
    references: [productVariants.id],
    relationName: 'VariantToImages',
  }),
}));

export const variantTagRelations = relations(variantTags, ({ one }) => ({
  productVariant: one(productVariants, {
    fields: [variantTags.variantId],
    references: [productVariants.id],
    relationName: 'VariantToTags',
  }),
}));

export const reviews = pgTable(
  'reviews',
  {
    id: serial('id').primaryKey(),
    rating: real('rating').notNull(),
    comment: text('comment').notNull(),
    created: timestamp('created').defaultNow(),
    updated: timestamp('updated').defaultNow(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    productId: serial('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
  },
  (table) => [
    {
      productIdx: index('product_idx').on(table.productId),
      userIdIdx: index('user_id_idx').on(table.userId),
    },
  ]
);

export const reviewRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
    relationName: 'ProductToReviews',
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
    relationName: 'UserToReviews',
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  reviews: many(reviews, { relationName: 'UserToReviews' }),
}));
