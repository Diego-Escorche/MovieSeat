import { z } from 'zod';

const reservationSchema = z.object({
  user: z.string,
  movie: z.string,
  functionId: z.string,
  seats: z.array(z.string),
  createdAt: z.date(),
});

export function validateReservation(object) {
  return reservationSchema.safeParse(object);
}

export function validatePartialReservation(object) {
  return reservationSchema.partial().safeParse(object);
}
