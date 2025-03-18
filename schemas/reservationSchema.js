import { z } from 'zod';

const reservationSchema = z.object({
  user: z.string,
  movie: z.string,
  functionId: z.string,
  seats: z.array(z.string),
  createdAt: z.date(),
});

export function validateReservation(object) {
  const { _id, ...data } = object;
  return reservationSchema.safeParse(data);
}

export function validatePartialReservation(object) {
  const { _id, ...data } = object;
  return reservationSchema.partial().safeParse(data);
}
