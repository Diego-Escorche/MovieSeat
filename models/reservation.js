import { Reservation } from '../models/mongodb/DBBroker';
import { Movie } from '../models/mongodb/DBBroker';
import { FunctionModel } from './function.js';
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
    const movie = await new Movie.findById(input.movie);
    if (!movie) return null;

    const reservedSeats = await new FunctionModel.reserveSeat({
      movieId: input.movie,
      functionId: input.function,
      seatNumber: input.seats,
    });
    if (reservedSeats) return null;

    const newReservation = new Reservation({
      _id: randomUUID(),
      ...input,
      seats: [reservedSeats.forEach((seat) => seat.seatNumber)],
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
  static async delete({ id }) {
    return await Reservation.findByIdAndDelete(id).catch((err) =>
      console.log(err),
    );
  }
}
