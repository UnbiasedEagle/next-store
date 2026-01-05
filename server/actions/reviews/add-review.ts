'use server';

import { ReviewSchema, ReviewSchemaType } from '@/lib/validations/reviews';
import { db } from '@/server/db';
import { reviews } from '@/server/db/schema';
import { createSafeActionClient } from 'next-safe-action';
import { auth } from '@/server/auth';
import { and, eq } from 'drizzle-orm';

const actionClient = createSafeActionClient();

export const addReview = actionClient
  .inputSchema(ReviewSchema)
  .action(async ({ parsedInput }: { parsedInput: ReviewSchemaType }) => {
    try {
      const session = await auth();
      if (!session?.user) {
        return { error: 'Please sign in to add a review' };
      }
      const existingReview = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productId, parsedInput.productID),
          eq(reviews.userId, session.user.id)
        ),
      });
      if (existingReview) {
        return { error: 'You have already reviewed this product' };
      }
      await db.insert(reviews).values({
        rating: parsedInput.rating,
        comment: parsedInput.comment,
        productId: parsedInput.productID,
        userId: session.user.id,
      });
      return { success: 'Review added successfully' };
    } catch {
      return { error: 'Failed to add review' };
    }
  });
