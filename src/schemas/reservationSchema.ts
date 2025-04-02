import { z } from 'zod';

// ------------------------
// 🎟️ Reservation Schema
// ------------------------

export const reservationSchema = z.object({
  user: z.string(),
  movie: z.string(),
  functionId: z.string(),
  seats: z.array(z.string()),
});

// ------------------------
// 🔍 Types
// ------------------------

export type ReservationInput = z.infer<typeof reservationSchema>;

// ------------------------
// ✅ Validators
// ------------------------

export function validateReservation(object: unknown) {
  const { _id, ...data } = object as Record<string, unknown>;
  return reservationSchema.safeParse(data);
}

export function validatePartialReservation(object: unknown) {
  const { _id, ...data } = object as Record<string, unknown>;
  return reservationSchema.partial().safeParse(data);
}
