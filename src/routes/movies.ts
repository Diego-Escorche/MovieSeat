/**
 * @fileoverview This file defines the routes for handling movie-related operations.
 * It includes routes for getting all movies, getting a movie by ID, creating a new movie,
 * updating a movie, and deleting a movie.
 */

import { Router } from 'express';
import { MovieController } from '../controllers/movie.js';
import { authenticate, authorize } from '../middlewares/auth/auth.js';
import { MovieService } from '../services/movie.js';
import { UserService } from '../services/user.js';

interface CreateMovieRouterProps {
  movieService: MovieService;
  userService: UserService;
}

export const createMovieRouter = ({
  movieService,
  userService,
}: CreateMovieRouterProps): Router => {
  const moviesRouter = Router();

  const movieController = new MovieController(movieService);

  // ------------------- ROUTES -------------------------

  moviesRouter.get('/', authenticate({ userService }), movieController.getAll);

  moviesRouter.get(
    '/:id',
    authenticate({ userService }),
    movieController.getById,
  );

  moviesRouter.post(
    '/',
    authenticate({ userService }),
    authorize('admin'),
    movieController.create,
  );

  moviesRouter.patch(
    '/:id',
    authenticate({ userService }),
    authorize('admin'),
    movieController.update,
  );

  moviesRouter.delete(
    '/:id',
    authenticate({ userService }),
    authorize('admin'),
    movieController.delete,
  );

  // ------------------- FUNCTIONS -------------------------

  moviesRouter.get(
    '/:id/functions/:functionId/seats',
    authenticate({ userService }),
    movieController.listAvailableSeats,
  );

  moviesRouter.get(
    '/:id/functions',
    authenticate({ userService }),
    movieController.getAllFunctions,
  );

  moviesRouter.post('/:id/reserve', movieController.reserveSeats);

  moviesRouter.post(
    '/:id/functions',
    authenticate({ userService }),
    authorize('admin'),
    movieController.addFunction,
  );

  moviesRouter.delete(
    '/:id/functions/:functionId',
    authenticate({ userService }),
    authorize('admin'),
    movieController.deleteFunction,
  );

  return moviesRouter;
};
