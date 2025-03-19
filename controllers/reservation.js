import {
  validateReservation,
  validatePartialReservation,
} from '../schemas/reservationSchema.js';
import { asyncHandler } from '../utils.js';

export class ReservationController {
  constructor({ reservationModel, userModel, movieModel }) {
    this.reservationModel = reservationModel;
    this.userModel = userModel;
    this.movieModel = movieModel;
  }

  getAll = asyncHandler(async (req, res) => {
    const { date } = req.query;
    const query = { multiple: true };
    if (date) query.createdAt = date;

    const reservations = await this.reservationModel.getReservations(query);

    return res.json(reservations);
  });

  getByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'Invalid request syntax' });
    }

    const { date } = req.query;

    const query = {
      user: userId,
      ...(date && { createdAt: date }),
      multiple: true,
    };

    const reservations = await this.reservationModel.getReservations(query);

    return res.json(reservations);
  });

  /**
   * Function that will create a reservation after validating the data stored
   * in the body of the request.
   * @param {*} req
   * @param {*} res
   * @returns The validation in a json if it created it. If an error ocurred it will send
   * a json with a message.
   */
  create = asyncHandler(async (req, res) => {
    const validation = validateReservation(req.body);
    if (!validation.success)
      return res
        .status(400)
        .json({ message: JSON.parse(validation.error.message) });

    const newReservation = await this.reservationModel.create({
      input: validation.data,
    });

    if (!newReservation) {
      return res
        .status(400)
        .json({ message: 'Reservation could not be created' });
    }

    return res.json(newReservation);
  });

  update = asyncHandler(async (req, res) => {
    const validation = validatePartialReservation(req.body);
    if (!validation.success) return res.status(400).json(validation.error);

    const { id } = req.params;

    const updatedReservation = await this.reservationModel.update({
      id: id,
      input: validation.data,
    });

    if (!updatedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    return res.json(updatedReservation);
  });

  delete = asyncHandler(async (req, res) => {
    const { id, userId } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid ID format' });

    const check = await this.reservationModel.cancelReservation({
      id: id,
      userId: userId,
    });

    if (!check) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    return res.json({ message: 'Reservation deleted successfully' });
  });
}
