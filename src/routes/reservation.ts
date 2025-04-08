import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.js';
import { authenticate, authorize } from '../middlewares/auth/auth.js';
import { ReservationService } from '../services/reservation.js';
import { UserService } from '../services/user.js';
import { MovieService } from '../services/movie.js';
interface CreateReservationRouterProps {
  reservationModel: ReservationService;
  userModel: UserService;
  movieModel: MovieService;
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
    authenticate({ userService: userModel }),
    authorize('admin'),
    reservationController.getAll,
  );

  reservationRouter.get(
    '/:userId',
    authenticate({ userService: userModel }),
    reservationController.getByUserId,
  );

  reservationRouter.post(
    '/',
    authenticate({ userService: userModel }),
    reservationController.create,
  );

  // reservationRouter.patch(
  //   '/:id',
  //   authenticate({ userModel }), ← Uncomment if needed
  //   reservationController.update
  // );

  reservationRouter.delete(
    '/:id/:functionId',
    authenticate({ userService: userModel }),
    reservationController.delete,
  );

  return reservationRouter;
};
