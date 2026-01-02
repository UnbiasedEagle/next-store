import z from 'zod';

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters long',
  }),
  description: z.string().min(40, {
    message: 'Description must be at least 40 characters long',
  }),
  price: z.coerce
    .number<number>()
    .positive({ message: 'Price must be a positive number' }),
});

export const GetProductSchema = z.object({
  id: z.number(),
});

export const DeleteProductSchema = z.object({
  id: z.number(),
});

export const VariantSchema = z.object({
  productID: z.number(),
  id: z.number().optional(),
  editMode: z.boolean(),
  productType: z
    .string()
    .min(3, { message: 'Product type must be at least 3 characters long' }),
  color: z
    .string()
    .min(3, { message: 'Color must be at least 3 characters long' }),
  tags: z.array(z.string()).min(1, {
    message: 'You must provide at least one tag',
  }),
  variantImages: z
    .array(
      z.object({
        url: z.string().refine((url) => url.search('blob:') !== 0, {
          message: 'Please wait for the image to upload',
        }),
        size: z.number(),
        key: z.string().optional(),
        id: z.number().optional(),
        name: z.string(),
      })
    )
    .min(1, { message: 'You must provide at least one image' }),
});

export type VariantSchemaType = z.infer<typeof VariantSchema>;

export type ProductSchemaType = z.infer<typeof ProductSchema>;
