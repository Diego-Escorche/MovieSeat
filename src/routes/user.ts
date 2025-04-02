/**
 * @fileoverview
 * Defines and exports routes for user authentication, management, and role operations.
 * Includes login, registration, deletion, updates, promotions, and logout.
 * All sensitive actions are protected using authentication and authorization middleware.
 */

import { Router } from 'express';
import { UserController } from '../controllers/user.js';
import { authenticate, authorize } from '../middlewares/auth/auth.js';
import { Model } from 'mongoose';
import { IUser } from '../interfaces/user.js';

interface CreateUserRouterProps {
  userModel: Model<IUser>;
}

export const createUserRouter = ({
  userModel,
}: CreateUserRouterProps): Router => {
  const userRouter = Router();
  const userController = new UserController({ userModel });

  // ------------------- ROUTES -------------------------

  /**
   * Logs in a user and sets a cookie with the JWT token.
   */
  userRouter.post('/login', userController.login);

  /**
   * Registers a new user and automatically logs them in.
   */
  userRouter.post('/register', userController.register);

  /**
   * Deletes a user by ID. Requires authentication.
   */
  userRouter.delete(
    '/delete/:id',
    authenticate({ userModel }),
    userController.delete,
  );

  /**
   * Updates user information such as email or password. Requires authentication.
   */
  userRouter.patch(
    '/update/:userId',
    authenticate({ userModel }),
    userController.update,
  );

  /**
   * Promotes a user to admin. Requires authentication and admin role.
   */
  userRouter.patch(
    '/promote/:userId',
    authenticate({ userModel }),
    authorize('admin'),
    userController.promoteToAdmin,
  );

  /**
   * Logs out a user by clearing the access token cookie. Requires authentication.
   */
  userRouter.post(
    '/logout',
    authenticate({ userModel }),
    userController.logout,
  );

  return userRouter;
};
