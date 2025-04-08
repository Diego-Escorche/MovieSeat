import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.js';
import { authenticate, authorize } from '../middlewares/auth/auth.js';
import { ReservationService } from '../services/reservation.js';
import { UserService } from '../services/user.js';
import { MovieService } from '../services/movie.js';
interface CreateReservationRouterProps {
  reservationService: ReservationService;
  userService: UserService;
  movieService: MovieService;
}

export const createReservationRouter = ({
  reservationService,
  userService,
  movieService,
}: CreateReservationRouterProps): Router => {
  const reservationRouter = Router();

  const reservationController = new ReservationController(
    reservationService,
    movieService,
  );

  // ------------------- ROUTES -------------------------

  reservationRouter.get(
    '/',
    authenticate({ userService }),
    authorize('admin'),
    reservationController.getAll,
  );

  reservationRouter.get(
    '/:userId',
    authenticate({ userService }),
    reservationController.getByUserId,
  );

  reservationRouter.post(
    '/',
    authenticate({ userService }),
    reservationController.create,
  );

  // reservationRouter.patch(
  //   '/:id',
  //   authenticate({ userService }), ← Uncomment if needed
  //   reservationController.update
  // );

  reservationRouter.delete(
    '/:id/:functionId',
    authenticate({ userService }),
    reservationController.delete,
  );

  return reservationRouter;
};
