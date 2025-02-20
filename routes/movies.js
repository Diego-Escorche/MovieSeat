/**
 * @fileoverview This file defines the routes for handling movie-related operations.
 * It includes routes for getting all movies, getting a movie by ID, creating a new movie,
 * updating a movie, and deleting a movie.
 */

import { Router } from 'express';
import { MovieController } from '../controllers/movie.js';

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router();
  const movieController = new movieController({ movieModel });

  // ------------------- RUTAS -------------------------

  moviesRouter.get('/', MovieController.getAll);
  moviesRouter.get('/:id', MovieController.getById);
  moviesRouter.post('/', MovieController.create);
  moviesRouter.patch('/:id', MovieController.update);
  moviesRouter.delete('/:id', MovieController.delete);
};
