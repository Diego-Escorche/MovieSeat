/**
 * @fileoverview
 * Defines and exports routes for user authentication, management, and role operations.
 * Includes login, registration, deletion, updates, promotions, and logout.
 * All sensitive actions are protected using authentication and authorization middleware.
 */

import { Router } from 'express';
import { UserController } from '../controllers/user.js';
import { authenticate, authorize } from '../middlewares/auth/auth.js';
import { UserService } from '../services/user.js';
interface CreateUserRouterProps {
  userService: UserService;
}

export const createUserRouter = ({
  userService,
}: CreateUserRouterProps): Router => {
  const userRouter = Router();
  const userController = new UserController(userService);

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
    authenticate({ userService }),
    userController.delete,
  );

  /**
   * Updates user information such as email or password. Requires authentication.
   */
  userRouter.patch(
    '/update/:userId',
    authenticate({ userService }),
    userController.update,
  );

  /**
   * Promotes a user to admin. Requires authentication and admin role.
   */
  userRouter.patch(
    '/promote/:userId',
    authenticate({ userService }),
    authorize('admin'),
    userController.promoteToAdmin,
  );

  /**
   * Logs out a user by clearing the access token cookie. Requires authentication.
   */
  userRouter.post(
    '/logout',
    authenticate({ userService }),
    userController.logout,
  );

  return userRouter;
};
