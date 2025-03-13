import { Reservation } from '../models/mongodb/DBBroker';
import { randomUUID } from 'crypto';

export class ReservationModel {
  /**
   * Gets all the reservations stored in the database.
   * @param {*} param0 An Object containing the date.
   * @returns All the reservations that where found. Otherwise a null.
   */
  static async getAll({ createdAt }) {
    let reservations;

    if (createdAt) {
      reservations = await Reservation.find({ createdAt: createdAt });
    } else {
      reservations = await Reservation.find({});
    }

    return reservations;
  }

  static async getByUserId({ id, date }) {}

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
    return await Reservation.findByIdAndUpdate({ _id: id }, input, {
      new: true,
    }).catch((err) => console.log(err));
  }

  /**
   * Finds the reservation using its id and deletes it.
   * @param {*} param0 Object containing the id.
   * @returns The reservation if it existed, otherwise null.
   */
  static async delete({ id }) {
    return await Reservation.findByIdAndDelete({
      _id: id,
    }).catch((err) => console.log(err));
  }
}
