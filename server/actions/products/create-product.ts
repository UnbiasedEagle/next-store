'use server';

import { ProductSchema } from '@/lib/validations/product';
import { db } from '@/server/db';
import { products } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';

const action = createSafeActionClient();

export const createProduct = action
  .inputSchema(ProductSchema)
  .action(async ({ parsedInput: { id, description, price, title } }) => {
    try {
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });
        if (!currentProduct) return { error: 'Product not found' };
        const editedProduct = await db
          .update(products)
          .set({ description, price, title })
          .where(eq(products.id, id))
          .returning();
        revalidatePath('/dashboard/products');
        return { success: `Product ${editedProduct[0].title} has been edited` };
      }
      const newProduct = await db
        .insert(products)
        .values({ description, price, title })
        .returning();
      revalidatePath('/dashboard/products');
      return { success: `Product ${newProduct[0].title} has been created` };
    } catch {
      return { error: 'Failed to create product' };
    }
  });
