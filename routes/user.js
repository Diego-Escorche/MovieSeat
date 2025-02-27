import { Router } from 'express';
import { UserController } from '../controllers/user.js';

export const createUserRouter = ({ userModel }) => {
  const userRouter = Router();

  const userController = new UserController({ userModel });

  // ------------------- RUTAS -------------------------

  userRouter.post('/', userController.login);
  userRouter.post('/', userController.register);
  userRouter.delete('/:id', userController.delete);
  userRouter.logout('/', userController.logout);

  return userRouter;
};
