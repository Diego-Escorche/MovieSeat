import { Router } from 'express';
import { UserController } from '../controllers/user.js';
import { authenticate, authorize } from '../middlewares/auth/auth.js';

export const createUserRouter = ({ userModel }) => {
  const userRouter = Router();

  const userController = new UserController({ userModel });

  // ------------------- ROUTES -------------------------

  userRouter.post('/', userController.login);
  userRouter.post('/', userController.register);
  userRouter.delete('/:id', userController.delete);
  userRouter.logout('/', userController.logout);
  userRouter.patch(
    '/promote/:userId',
    authenticate({ userModel }),
    authorize('admin'),
    userController.promoteToAdmin,
  );

  return userRouter;
};
