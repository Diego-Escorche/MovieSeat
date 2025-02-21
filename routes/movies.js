/**
 * @fileoverview This file defines the routes for handling movie-related operations.
 * It includes routes for getting all movies, getting a movie by ID, creating a new movie,
 * updating a movie, and deleting a movie.
 */

import { Router } from 'express';
import { MovieController } from '../controllers/movie.js';

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router();

  const movieController = new MovieController({ movieModel });

  // ------------------- RUTAS -------------------------

  moviesRouter.get('/', movieController.getAll);
  moviesRouter.get('/:id', movieController.getById);
  moviesRouter.post('/', movieController.create);
  moviesRouter.patch('/:id', movieController.update);
  moviesRouter.delete('/:id', movieController.delete);

  return moviesRouter;
};
