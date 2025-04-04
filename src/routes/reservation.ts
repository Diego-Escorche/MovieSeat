import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.js';
import { authenticate, authorize } from '../middlewares/auth/auth.js';
import { UserModel } from '../services/user.js';

export const createReservationRouter = (): Router => {
  const reservationRouter = Router();

  const reservationController = new ReservationController();

  // ------------------- ROUTES -------------------------

  reservationRouter.get(
    '/',
    authenticate({ UserModel }),
    authorize('admin'),
    reservationController.getAll,
  );

  reservationRouter.get(
    '/:userId',
    authenticate({ UserModel }),
    reservationController.getByUserId,
  );

  reservationRouter.post(
    '/',
    authenticate({ UserModel }),
    reservationController.create,
  );

  // reservationRouter.patch(
  //   '/:id',
  //   authenticate({ UserModel }), ← Uncomment if needed
  //   reservationController.update
  // );

  reservationRouter.delete(
    '/:id/:functionId',
    authenticate({ UserModel }),
    reservationController.delete,
  );

  return reservationRouter;
};
