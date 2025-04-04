import { Request, Response } from 'express';
import {
  validateReservation,
  validatePartialReservation,
} from '../schemas/reservationSchema.js';
import { asyncHandler } from '../utils.js';
import { ReservationModel } from '../services/reservation.js';
import { MovieModel } from '../services/movie.js';

export class ReservationController {
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.query;
    const query: any = { multiple: true };

    if (date) query.createdAt = date;

    const reservations = await ReservationModel.getReservations(query);
    return res.json(reservations);
  });

  getByUserId = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid request syntax' });
    }

    const { date } = req.query;

    const query: any = {
      user: userId,
      ...(date && { createdAt: date }),
      multiple: true,
    };

    const reservations = await ReservationModel.getReservations(query);
    return res.json(reservations);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const validation = validateReservation(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ message: JSON.parse(validation.error.message) });
    }

    const { movie, functionId, seats } = validation.data;

    const reservedSeats = await MovieModel.reserveSeat({
      movieId: movie,
      functionId,
      seats,
    });

    if (!reservedSeats) {
      return res.status(400).json({ message: 'Seats could not be reserved' });
    }

    const newReservation = await ReservationModel.create({
      input: validation.data,
    });

    if (!newReservation) {
      return res
        .status(400)
        .json({ message: 'Reservation could not be created' });
    }

    return res.json(newReservation);
  });

  // Uncomment this block and type it properly once update is needed
  // update = asyncHandler(async (req: Request, res: Response) => {
  //   const validation = validatePartialReservation(req.body);
  //   if (!validation.success) return res.status(400).json(validation.error);
  //
  //   const { id } = req.params;
  //   const updatedReservation = await ReservationModel.update({
  //     id,
  //     input: validation.data,
  //   });
  //
  //   if (!updatedReservation) {
  //     return res.status(404).json({ message: 'Reservation not found' });
  //   }
  //
  //   return res.json(updatedReservation);
  // });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id, functionId } = req.params;
    if (!id || !functionId) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const deletedReservation = await ReservationModel.cancelReservation({
      reservationId: id,
      functionId,
    });

    if (!deletedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    return res.json({ message: 'Reservation deleted successfully' });
  });
}
