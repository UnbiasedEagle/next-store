import z from 'zod';

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.email()),
    password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 8, {
        message: 'Password must be at least 8 characters long',
      }),
    newPassword: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 8, {
        message: 'New password must be at least 8 characters long',
      }),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0 && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'New password is required',
      path: ['newPassword'],
    }
  );

export type SettingsSchemaType = z.infer<typeof SettingsSchema>;
