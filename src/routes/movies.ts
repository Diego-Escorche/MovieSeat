/**
 * @fileoverview This file defines the routes for handling movie-related operations.
 * It includes routes for getting all movies, getting a movie by ID, creating a new movie,
 * updating a movie, and deleting a movie.
 */

import { Router } from 'express';
import { MovieController } from '../controllers/movie.js';
import { authenticate, authorize } from '../middlewares/auth/auth.js';
import { UserModel } from '../services/user.js';

export const createMovieRouter = (): Router => {
  const moviesRouter = Router();

  const movieController = new MovieController();

  // ------------------- ROUTES -------------------------

  moviesRouter.get('/', authenticate({ UserModel }), movieController.getAll);

  moviesRouter.get(
    '/:id',
    authenticate({ UserModel }),
    movieController.getById,
  );

  moviesRouter.post(
    '/',
    authenticate({ UserModel }),
    authorize('admin'),
    movieController.create,
  );

  moviesRouter.patch(
    '/:id',
    authenticate({ UserModel }),
    authorize('admin'),
    movieController.update,
  );

  moviesRouter.delete(
    '/:id',
    authenticate({ UserModel }),
    authorize('admin'),
    movieController.delete,
  );

  // ------------------- FUNCTIONS -------------------------

  moviesRouter.get(
    '/:id/functions/:functionId/seats',
    authenticate({ UserModel }),
    movieController.listAvailableSeats,
  );

  moviesRouter.get(
    '/:id/functions',
    authenticate({ UserModel }),
    movieController.getAllFunctions,
  );

  moviesRouter.post('/:id/reserve', movieController.reserveSeats);

  moviesRouter.post(
    '/:id/functions',
    authenticate({ UserModel }),
    authorize('admin'),
    movieController.addFunction,
  );

  moviesRouter.delete(
    '/:id/functions/:functionId',
    authenticate({ UserModel }),
    authorize('admin'),
    movieController.deleteFunction,
  );

  return moviesRouter;
};
