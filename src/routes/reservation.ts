import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.js';
import { authenticate, authorize } from '../middlewares/auth/auth.js';
import { ReservationModel } from '../services/reservation.js';
import { UserModel } from '../services/user.js';
import { MovieModel } from '../services/movie.js';
interface CreateReservationRouterProps {
  reservationModel: ReservationModel;
  userModel: UserModel;
  movieModel: MovieModel;
}

export const createReservationRouter = ({
  reservationModel,
  userModel,
  movieModel,
}: CreateReservationRouterProps): Router => {
  const reservationRouter = Router();

  const reservationController = new ReservationController(
    reservationModel,
    movieModel,
  );

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
