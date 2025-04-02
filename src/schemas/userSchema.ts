import { z } from 'zod';

// ------------------------
// 👤 User Schema
// ------------------------

export const userSchema = z.object({
  username: z
    .string({
      invalid_type_error: 'Username must be a string.',
      required_error: 'Username is required.',
    })
    .min(3, {
      message: 'Username must be at least 3 characters',
    }),

  email: z.string().email({
    message: 'Email must be a valid email address',
  }),

  password: z.string().min(8, {
    message: 'Password must be at least 8 characters',
  }),

  role: z.array(z.enum(['user', 'admin'])).default(['user']),
});

// ------------------------
// 🔍 Types
// ------------------------

export type UserInput = z.infer<typeof userSchema>;

// ------------------------
// ✅ Validators
// ------------------------

export function validateUser(object: unknown) {
  const { _id, ...data } = object as Record<string, unknown>;
  return userSchema.safeParse(data);
}

export function validatePartialUser(object: unknown) {
  const { _id, ...data } = object as Record<string, unknown>;
  return userSchema.partial().safeParse(data);
}
