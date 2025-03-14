import { z } from 'zod';

const reservationSchema = z.object({
  user: z.string,
  movie: z.string,
  functionId: z.string,
  seats: z.array(z.string),
  createdAt: z.date(),
});

export function validateMovie(object) {
  const { _id, ...data } = object;
  return movieSchema.safeParse(data);
}

export function validatePartialMovie(object) {
  const { _id, ...data } = object;
  return movieSchema.partial().safeParse(data);
}
