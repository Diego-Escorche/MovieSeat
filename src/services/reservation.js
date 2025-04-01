import { Reservation, Movie } from '../models/mongodb/DBBroker.js';
import { randomUUID } from 'crypto';

export class ReservationModel {
  /**
   * Gets all the reservations stored in the database.
   * @param {*} param0 An Object containing the date.
   * @returns All the reservations that where found. Otherwise a null.
   */
  static async getReservations({ createdAt, user, multiple = false }) {
    const query = {
      ...(createdAt && { createdAt: createdAt }),
      ...(user && { user: user }),
    };

    return multiple
      ? await Reservation.find(query) // Get multiple documents
      : await Reservation.findOne(query); // Get a single document
  }

  /**
   * Stores a reservation on the database.
   * @param {*} param0 An Object with the reservation data.
   * @returns The new Reservation after its stored on the database.
   */
  static async create({ input }) {
    const newReservation = new Reservation({
      _id: randomUUID(),
      ...input,
    });

    await newReservation.save().catch((err) => console.log(err));
    return newReservation;
  }

  /**
   * Finds the reservation using its id and updates it with the input data.
   * @param {*} param0 An Object containing the id and input data.
   * @returns The updated reservation if it exists, otherwise null.
   */
  static async update({ id, input }) {
    return await Reservation.findByIdAndUpdate(id, input, {
      new: true,
    }).catch((err) => console.log(err));
  }

  /**
   * Finds the reservation using its id and deletes it.
   * @param {*} param0 Object containing the id.
   * @returns The reservation if it existed, otherwise null.
   */
  static async cancelReservation({ reservationId, functionId }) {
    const deletedReservations =
      await Reservation.findByIdAndDelete(reservationId);
    if (!deletedReservations) return null;

    const { movie, seats } = deletedReservations;
    return await Movie.findOneAndUpdate(
      {
        _id: movie,
        functions: {
          $elemMatch: {
            _id: functionId,
            seats: {
              $all: seats.map((seatNumber) => ({
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
