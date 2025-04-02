import mongoose, { Schema, Model } from 'mongoose';
import { IReservation } from '../interfaces/reservation.js';

const reservationSchema = new Schema<IReservation>(
  {
    _id: { type: String, unique: true },
    user: { type: String },
    movie: { type: String },
    functionId: { type: String },
    seats: [{ type: String }],
    createdAt: { type: Date, default: Date.now() },
  },
  { timestamps: true },
);

export const Reservation: Model<IReservation> = mongoose.model<IReservation>(
  'Reservation',
  reservationSchema,
);
