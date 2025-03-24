import { Router } from 'express';
import { UserController } from '../controllers/user.js';
import { authenticate, authorize } from '../middlewares/auth/auth.js';

export const createUserRouter = ({ userModel }) => {
  const userRouter = Router();

  const userController = new UserController({ userModel });

  // ------------------- ROUTES -------------------------

  userRouter.post('/login', userController.login);
  userRouter.post('/register', userController.register);
  userRouter.delete(
    '/delete/:id',
    authenticate({ userModel: userModel }),
    userController.delete,
  );
  userRouter.patch(
    '/update/:userId',
    authenticate({ userModel: userModel }),
    userController.update,
  );
  userRouter.patch(
    '/promote/:userId',
    authenticate({ userModel: userModel }),
    authorize('admin'),
    userController.promoteToAdmin,
  );
  userRouter.post(
    '/logout',
    authenticate({ userModel: userModel }),
    userController.logout,
  );

  return userRouter;
};
