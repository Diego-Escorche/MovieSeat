import { validateReservation } from '../schemas/reservationSchema.js';
import bcrypt from 'bcrypt';
import JWT_SECRET from '../.env';
import { asyncHandler } from '../utils.js';

export class ReservationController {
  constructor({ reservationModel, userModel, movieModel }) {
    (this.reservationModel = reservationModel),
      (this.userModel = userModel),
      (this.movieModel = movieModel);
  }

  getAll = asyncHandler(async (req, res) => {
    const { date } = req.query;
    let reservations;

    if (date) {
      reservations = await this.reservationModel.getAll({
        createdAt: date,
      });
    } else {
      reservations = await this.reservationModel.getAll();
    }

    return res.json(reservations);
  });

  create = asyncHandler(async (req, res) => {
    const reservation = req.body;
    const validation = validateReservation(reservation);
    if (!validation.success) return res.status(400).json(validation.error);

    const newReservation = await this.reservationModel.create(reservation);
    return res.json(newReservation);
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const reservation = req.body;
    const validation = validateReservation(reservation);
    if (!validation.success) return res.status(400).json(validation.error);

    const updatedReservation = await this.reservationModel.update(
      id,
      reservation,
    );
    return res.json(updatedReservation);
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await this.reservationModel.delete(id);
    return res.json({ message: 'Reservation deleted successfully' });
  });
}
