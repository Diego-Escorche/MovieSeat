import { Movie } from '../models/movie.js';
import { Reservation } from '../models/reservation.js';
import { randomUUID } from 'crypto';
import { IReservation } from '../interfaces/reservation.js';
import { Document } from 'mongoose';

type ReservationDoc = Document<unknown, {}, IReservation> & IReservation;

export class ReservationModel {
  /**
   * Gets reservations based on optional date/user filters.
   */
  static async getReservations({
    createdAt,
    user,
    multiple = false,
  }: {
    createdAt?: Date;
    user?: string;
    multiple?: boolean;
  }): Promise<ReservationDoc[] | ReservationDoc | null> {
    const query: Partial<Pick<IReservation, 'createdAt' | 'user'>> = {
      ...(createdAt && { createdAt: createdAt }),
      ...(user && { user: user }),
    };

    return multiple
      ? await Reservation.find(query)
      : await Reservation.findOne(query);
  }

  /**
   * Stores a reservation in the database.
   */
  static async create({
    input,
  }: {
    input: Omit<IReservation, '_id' | 'createdAt'>;
  }): Promise<ReservationDoc> {
    const newReservation = new Reservation({
      _id: randomUUID(),
      ...input,
    });

    await newReservation.save().catch((err) => console.error(err));
    return newReservation;
  }

  /**
   * Updates a reservation by its ID.
   */
  static async update({
    id,
    input,
  }: {
    id: string;
    input: Partial<IReservation>;
  }): Promise<ReservationDoc | null> {
    return await Reservation.findByIdAndUpdate(id, input, {
      new: true,
    }).catch((err) => {
      console.error(err);
      return null;
    });
  }

  /**
   * Cancels a reservation and updates seat availability.
   */
  static async cancelReservation({
    reservationId,
    functionId,
  }: {
    reservationId: string;
    functionId: string;
  }) {
    const deletedReservation =
      await Reservation.findByIdAndDelete(reservationId);
    if (!deletedReservation) return null;

    const { movie, seats } = deletedReservation;

    return await Movie.findOneAndUpdate(
      {
        _id: movie,
        functions: {
          $elemMatch: {
            _id: functionId,
            seats: {
              $all: seats.map((seatNumber: string) => ({
                $elemMatch: {
                  seatNumber,
                  isAvailable: false,
                },
              })),
            },
          },
        },
      },
      {
        $set: {
          'functions.$[func].seats.$[seat].isAvailable': true,
        },
      },
      {
        arrayFilters: [
          { 'func._id': functionId },
          { 'seat.seatNumber': { $in: seats } },
        ],
        new: true,
      },
    );
  }
}
