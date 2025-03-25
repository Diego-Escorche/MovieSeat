/**
 * @fileoverview This file defines the routes for handling movie-related operations.
 * It includes routes for getting all movies, getting a movie by ID, creating a new movie,
 * updating a movie, and deleting a movie.
 */

import { Router } from 'express';
import { MovieController } from '../controllers/movie.js';
import { authenticate, authorize } from '../middlewares/auth/auth.js';

export const createMovieRouter = ({ movieModel, userModel }) => {
  const moviesRouter = Router();

  const movieController = new MovieController({ movieModel });

  // ------------------- RUTAS -------------------------

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

  return moviesRouter;
};
