import z from 'zod';

export const CreateOrderSchema = z.object({
  total: z.number(),
  status: z.string(),
  paymentIntentID: z.string(),
  products: z.array(
    z.object({
      productID: z.number(),
      variantID: z.number(),
      quantity: z.number(),
    })
  ),
});

export const PaymentIntentSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  cart: z.array(
    z.object({
      quantity: z.number(),
      productID: z.number(),
      title: z.string(),
      price: z.number(),
      image: z.string(),
      variantID: z.number(),
    })
  ),
});

export type CreateOrderSchemaType = z.infer<typeof CreateOrderSchema>;
export type PaymentIntentSchemaType = z.infer<typeof PaymentIntentSchema>;
