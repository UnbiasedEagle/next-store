import z from 'zod';

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters long',
  }),
  description: z.string().min(40, {
    message: 'Description must be at least 40 characters long',
  }),
  price: z
    .number({
      error: (issue) => {
        switch (issue.code) {
          case 'invalid_type':
            return 'Price must be a number';
          default:
            return 'Invalid price';
        }
      },
    })
    .positive({ message: 'Price must be a positive number' }),
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;
