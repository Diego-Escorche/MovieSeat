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
  role: z.array(z.enum(['user', 'admin'])).default(['user']),
});

export function validateUser(object) {
  const { _id, ...data } = object;
  return userSchema.safeParse(data);
}

export function validatePartialUser(object) {
  const { _id, ...data } = object;
  return userSchema.partial().safeParse(data);
}
