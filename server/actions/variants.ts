'use server';

import { VariantSchema } from '@/lib/validations/product';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '../db';
import {
  productVariants,
  variantTags,
  variantImages,
  products,
} from '../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import z from 'zod';

const action = createSafeActionClient();

export const createVariant = action
  .inputSchema(VariantSchema)
  .action(
    async ({
      parsedInput: {
        color,
        editMode,
        productID,
        productType,
        tags,
        variantImages: newVariantImages,
        id,
      },
    }) => {
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({ color, productType, updatedAt: new Date() })
            .where(eq(productVariants.id, id))
            .returning();
          await db
            .delete(variantTags)
            .where(eq(variantTags.variantId, editVariant[0].id));

          await db.insert(variantTags).values(
            tags.map((tag) => ({
              variantId: editVariant[0].id,
              tag,
            }))
          );

          await db
            .delete(variantImages)
            .where(eq(variantImages.variantId, editVariant[0].id));

          await db.insert(variantImages).values(
            newVariantImages.map((img, idx) => ({
              name: img.name,
              size: img.size,
              imageUrl: img.url,
              variantId: editVariant[0].id,
              order: idx,
            }))
          );
          revalidatePath('/dashboard/products');
          return { success: `Edited ${productType}` };
        }
        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productType,
              productId: productID,
            })
            .returning();
          const product = await db.query.products.findFirst({
            where: eq(products.id, productID),
          });
          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantId: newVariant[0].id,
            }))
          );
          await db.insert(variantImages).values(
            newVariantImages.map((img, idx) => ({
              name: img.name,
              size: img.size,
              imageUrl: img.url,
              variantId: newVariant[0].id,
              order: idx,
            }))
          );
          revalidatePath('/dashboard/products');
          return { success: `Added ${productType}` };
        }
      } catch {
        return {
          error: 'Failed to create variant',
        };
      }
    }
  );

export const deleteVariant = action
  .inputSchema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();

      return {
        success: deletedVariant.length
          ? `Deleted ${deletedVariant[0].productType}`
          : 'Variant deleted',
      };
    } catch (error) {
      console.error('deleteVariant failed:', error);
      return { error: 'Failed to delete variant' };
    }
  });
