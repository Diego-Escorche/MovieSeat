import { z } from 'zod'; // To validate the JSON data

const reservationSchema = z.object({
  user: z.string,
  movie: z.string,
  functionId: z.string,
  seats: z.array(z.string),
  createdAt: z.date(),
});
export function validateUser(object) {
  return reservationSchema.safeParse(object);
}

export function validatePartialUser(object) {
  return reservationSchema.partial().safeParse(object);
}
