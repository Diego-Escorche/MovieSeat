import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.js';
import { authenticate, authorize } from '../middlewares/auth/auth.js';

export const createReservationRouter = ({
  reservationModel,
  userModel,
  movieModel,
}) => {
  const reservationRouter = Router();

  const reservationController = new ReservationController({
    reservationModel,
    userModel,
    movieModel,
  });

  // ------------------- ROUTES -------------------------

  reservationRouter.get(
    '/',
    // authenticate({ userModel }),
    // authorize('admin'),
    reservationController.getAll,
  );
  reservationRouter.get(
    '/:userId',
    // authenticate({ userModel }),
    reservationController.getByUserId,
  );
  reservationRouter.post(
    '/',
    // authenticate({ userModel }),
    reservationController.create,
  );
  // reservationRouter.patch(
  //   '/:id',
  //   // authenticate({ userModel }),
  //   reservationController.update,
  // );
  reservationRouter.delete(
    '/:id/:functionId',
    // authenticate({ userModel }),
    reservationController.delete,
  );

  return reservationRouter;
};
