'use server';

import { DeleteProductSchema } from '@/lib/validations/product';
import { db } from '@/server/db';
import { products } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';

const action = createSafeActionClient();

export const deleteProduct = action
  .inputSchema(DeleteProductSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedProduct = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      revalidatePath('/dashboard/products');
      return { success: `Product ${deletedProduct[0].title} has been deleted` };
    } catch {
      return { error: 'Failed to delete product' };
    }
  });
