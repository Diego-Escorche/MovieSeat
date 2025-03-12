import { Reservation } from '../models/mongodb/DBBroker';
import { randomUUID } from 'crypto';

export class ReservationModel {
  static async getAll({ createdAt }) {
    let reservations;

    if (createdAt) {
      reservations = await Reservation.find({ createdAt: createdAt });
    } else {
      reservations = await Reservation.find({});
    }

    return reservations;
  }

  static async create({ input }) {
    const newReservation = new Reservation({
      _id: randomUUID(),
      ...input,
    });

    await newReservation.save().catch((err) => console.log(err));
    return newReservation;
  }

  static async update({ id, input }) {
    return await Reservation.findByIdAndUpdate({ _id: id }, input, {
      new: true,
    }).catch((err) => console.log(err));
  }

  static async delete({ id }) {
    return await Reservation.findByIdAndDelete({
      _id: id,
    }).catch((err) => console.log(err));
  }
}
