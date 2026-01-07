'use server';

import {
  PaymentIntentSchema,
  PaymentIntentSchemaType,
} from '@/lib/validations/order';
import { createSafeActionClient } from 'next-safe-action';
import Stripe from 'stripe';
import { auth } from '@/server/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2025-12-15.clover',
});

const actionClient = createSafeActionClient();

export const createPaymentIntent = actionClient
  .inputSchema(PaymentIntentSchema)
  .action(async ({ parsedInput }: { parsedInput: PaymentIntentSchemaType }) => {
    try {
      const session = await auth();
      if (!session?.user) {
        return { error: 'Unauthorized' };
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: parsedInput.amount,
        currency: parsedInput.currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          cart: JSON.stringify(parsedInput.cart),
        },
      });

      return {
        success: {
          paymentIntentID: paymentIntent.id,
          clientSecretID: paymentIntent.client_secret,
          user: session.user.email,
        },
      };
    } catch {
      return {
        error: 'Failed to create payment intent',
      };
    }
  });
