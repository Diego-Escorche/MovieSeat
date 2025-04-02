import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.js';
import { authenticate, authorize } from '../middlewares/auth/auth.js';
import { Model } from 'mongoose';
import { IUser } from '../interfaces/user.js';
import { IMovie } from '../interfaces/movie.js';
import { IReservation } from '../interfaces/reservation.js';

interface CreateReservationRouterProps {
  reservationModel: Model<IReservation>;
  userModel: Model<IUser>;
  movieModel: Model<IMovie>;
}

export const createReservationRouter = ({
  reservationModel,
  userModel,
  movieModel,
}: CreateReservationRouterProps): Router => {
  const reservationRouter = Router();

  const reservationController = new ReservationController({
    reservationModel,
    userModel,
    movieModel,
  });

  // ------------------- ROUTES -------------------------

  reservationRouter.get(
    '/',
    authenticate({ userModel }),
    authorize('admin'),
    reservationController.getAll,
  );

  reservationRouter.get(
    '/:userId',
    authenticate({ userModel }),
    reservationController.getByUserId,
  );

  reservationRouter.post(
    '/',
    authenticate({ userModel }),
    reservationController.create,
  );

  // reservationRouter.patch(
  //   '/:id',
  //   authenticate({ userModel }), ← Uncomment if needed
  //   reservationController.update
  // );

  reservationRouter.delete(
    '/:id/:functionId',
    authenticate({ userModel }),
    reservationController.delete,
  );

  return reservationRouter;
};
