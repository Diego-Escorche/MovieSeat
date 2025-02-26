import { z } from 'zod'; // To validate the JSON data

// Validate the data with a schema.
const userSchema = z.object({
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
});

export function validateUser(object) {
  return userSchema.safeParse(object);
}

export function validatePartialUser(object) {
  return userSchema.partial().safeParse(object);
}
