'use server';

import {
  CreateOrderSchema,
  CreateOrderSchemaType,
} from '@/lib/validations/order';
import { auth } from '@/server/auth';
import { db } from '@/server/db';
import { orderProducts, orders } from '@/server/db/schema';
import { createSafeActionClient } from 'next-safe-action';
import { eq } from 'drizzle-orm';

const actionClient = createSafeActionClient();

export const createOrder = actionClient
  .inputSchema(CreateOrderSchema)
  .action(async ({ parsedInput }: { parsedInput: CreateOrderSchemaType }) => {
    try {
      const session = await auth();
      if (!session?.user) {
        return { error: 'Unauthorized' };
      }

      const existingOrder = await db.query.orders.findFirst({
        where: eq(orders.paymentIntentID, parsedInput.paymentIntentID),
      });

      if (existingOrder) {
        return { success: 'Order created successfully' };
      }

      const order = await db
        .insert(orders)
        .values({
          userId: session.user.id,
          total: parsedInput.total,
          status: 'pending',
          paymentIntentID: parsedInput.paymentIntentID,
        })
        .returning();

      await db.insert(orderProducts).values(
        parsedInput.products.map((product) => ({
          productVariantId: product.variantID,
          orderId: order[0].id,
          productId: product.productID,
          quantity: product.quantity,
        }))
      );

      return { success: 'Order created successfully' };
    } catch {
      return { error: 'Failed to create order' };
    }
  });
