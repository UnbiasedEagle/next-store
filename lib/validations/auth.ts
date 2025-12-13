import z from 'zod';

export const LoginSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
  name: z.string().min(4, {
    message: 'Name must be at least 4 characters long',
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  token: z.string().nullable().optional(),
});

export const ResetPasswordSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address',
  }),
});

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
