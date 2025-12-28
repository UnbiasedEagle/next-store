'use server';

import { GetProductSchema } from '@/lib/validations/product';
import { db } from '@/server/db';
import { products } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';

const action = createSafeActionClient();

export const getProduct = action
  .inputSchema(GetProductSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const product = await db.query.products.findFirst({
        where: eq(products.id, id),
      });
      if (!product) {
        return { error: 'Product not found' };
      }
      return { success: product };
    } catch {
      return { error: 'Failed to get product' };
    }
  });
