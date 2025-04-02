/**
 * @fileoverview This file defines the routes for handling movie-related operations.
 * It includes routes for getting all movies, getting a movie by ID, creating a new movie,
 * updating a movie, and deleting a movie.
 */

import { Router } from 'express';
import { MovieController } from '../controllers/movie.js';
import { authenticate, authorize } from '../middlewares/auth/auth.js';
import { Model } from 'mongoose';
import { IMovie } from '../interfaces/movie.js';
import { IUser } from '../interfaces/user.js';

interface CreateMovieRouterProps {
  movieModel: Model<IMovie>;
  userModel: Model<IUser>;
}

export const createMovieRouter = ({
  movieModel,
  userModel,
}: CreateMovieRouterProps): Router => {
  const moviesRouter = Router();

  const movieController = new MovieController({ movieModel });

  // ------------------- ROUTES -------------------------

  moviesRouter.get('/', authenticate({ userModel }), movieController.getAll);

  moviesRouter.get(
    '/:id',
    authenticate({ userModel }),
    movieController.getById,
  );

  moviesRouter.post(
    '/',
    authenticate({ userModel }),
    authorize('admin'),
    movieController.create,
  );

  moviesRouter.patch(
    '/:id',
    authenticate({ userModel }),
    authorize('admin'),
    movieController.update,
  );

  moviesRouter.delete(
    '/:id',
    authenticate({ userModel }),
    authorize('admin'),
    movieController.delete,
  );

  // ------------------- FUNCTIONS -------------------------

  moviesRouter.get(
    '/:id/functions/:functionId/seats',
    authenticate({ userModel }),
    movieController.listAvailableSeats,
  );

  moviesRouter.get(
    '/:id/functions',
    authenticate({ userModel }),
    movieController.getAllFunctions,
  );

  moviesRouter.post('/:id/reserve', movieController.reserveSeats);

  moviesRouter.post(
    '/:id/functions',
    authenticate({ userModel }),
    authorize('admin'),
    movieController.addFunction,
  );

  moviesRouter.delete(
    '/:id/functions/:functionId',
    authenticate({ userModel }),
    authorize('admin'),
    movieController.deleteFunction,
  );

  return moviesRouter;
};
