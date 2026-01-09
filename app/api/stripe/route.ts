import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/server/db';
import { orders, orderProducts } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET!, {
    apiVersion: '2025-12-15.clover',
  });
  const sig = req.headers.get('stripe-signature') || '';
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  const reqText = await req.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(reqText, sig, signingSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const userId = paymentIntent.metadata.userId;
      const cartText = paymentIntent.metadata.cart;

      // Get the receipt URL
      let receiptURL = null;
      if (paymentIntent.latest_charge) {
        const charge = await stripe.charges.retrieve(
          paymentIntent.latest_charge as string
        );
        receiptURL = charge.receipt_url;
      }

      // Check if order already exists
      const existingOrder = await db.query.orders.findFirst({
        where: eq(orders.paymentIntentID, paymentIntent.id),
      });

      if (existingOrder) {
        // Update order status if needed
        await db
          .update(orders)
          .set({
            status: 'succeeded',
            receiptURL: receiptURL,
          })
          .where(eq(orders.id, existingOrder.id));
      } else {
        // Create new order
        if (userId && cartText) {
          const cart = JSON.parse(cartText);
          const total = paymentIntent.amount / 100;

          const [newOrder] = await db
            .insert(orders)
            .values({
              userId,
              total,
              status: 'succeeded',
              paymentIntentID: paymentIntent.id,
              receiptURL: receiptURL,
            })
            .returning();

          if (newOrder) {
            const productsToInsert = cart.map((item: any) => ({
              productVariantId: item.variantID,
              orderId: newOrder.id,
              productId: item.productID,
              quantity: item.quantity,
            }));
            await db.insert(orderProducts).values(productsToInsert);
          }
        }
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse('Webhook received', { status: 200 });
}
