import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.js';
import { authenticate, authorize } from '../middlewares/auth/auth.js';

export const createReservationRouter = ({
  reservationModel,
  userModel,
  movieModel,
}) => {};
