import {
  validateReservation,
  validatePartialReservation,
} from '../schemas/reservationSchema.js';
import { asyncHandler } from '../utils.js';

export class ReservationController {
  constructor({ reservationModel, userModel, movieModel }) {
    (this.reservationModel = reservationModel),
      (this.userModel = userModel),
      (this.movieModel = movieModel);
  }

  getAll = asyncHandler(async (req, res) => {
    const { date } = req.query;
    let reservations = null;

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

    const newReservation = await this.reservationModel.create({ reservation });

    if (newReservation) {
      return res.json(newReservation);
    }

    res.status(400).json({ message: 'Reservation could not be created' });
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const reservation = req.body;
    const validation = validatePartialReservation(reservation);

    if (!validation.success) return res.status(400).json(validation.error);

    const updatedReservation = await this.reservationModel.update({
      id,
      reservation,
    });

    if (updatedReservation) {
      return res.json(updatedReservation);
    }

    res.status(404).json({ message: 'Reservation not found' });
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const check = await this.reservationModel.delete({ id: id });

    if (check === true) {
      return res.json({ message: 'Reservation deleted successfully' });
    }

    res.status(404).json({ message: 'Reservation not found' });
  });
}
