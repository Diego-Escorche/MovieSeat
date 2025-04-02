/**
 * @fileoverview Controller for handling movie-related requests.
 * Supports full CRUD operations for movies, managing showtime functions,
 * and reserving or listing available seats.
 */

import { Request, Response } from 'express';
import {
  validateMovie,
  validatePartialMovie,
} from '../schemas/moviesSchema.js';
import { asyncHandler } from '../utils.js';
import { MovieModel } from '../services/movie.js';
import { IMovie } from '../interfaces/movie.js';

interface MovieControllerDeps {
  movieModel: MovieModel;
}

export class MovieController {
  private movieModel: MovieControllerDeps['movieModel'];

  constructor({ movieModel }: MovieControllerDeps) {
    this.movieModel = movieModel;
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { genre } = req.query;
    const movies = await this.movieModel.getAll({
      ...(genre && { genre: genre as string }),
    });
    return res.json(movies);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid Syntax' });

    const movie = await this.movieModel.getById({ id });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    return res.json(movie);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = validateMovie(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: JSON.parse(result.error.message) });
    }

    const { functions, ...movieData } = result.data;

    const newMovie = await this.movieModel.create({ input: movieData });
    if (!newMovie) {
      return res.status(500).json({ message: 'Movie could not be created' });
    }

    let functionUpdate = null;
    if (functions?.length) {
      functionUpdate = await this.movieModel.addFunction({
        movieId: newMovie._id,
        input: functions,
      });

      if (!newMovie) {
        return res
          .status(500)
          .json({ message: 'Function could not be created' });
      }
    }

    return res.status(201).json(newMovie);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid Syntax' });

    const deleted = await this.movieModel.delete({ id });
    if (!deleted) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    return res.json({ message: 'Movie deleted successfully' });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const result = validatePartialMovie(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid Syntax' });

    const updatedMovie = await this.movieModel.update({
      id,
      input: result.data as Partial<IMovie>,
    });

    if (!updatedMovie) {
      return res.status(500).json({ message: 'Movie could not be updated' });
    }

    return res.json(updatedMovie);
  });

  getAllFunctions = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid Syntax' });

    const functions = await this.movieModel.getFunctions({ movieId: id });
    if (!functions) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    return res.json(functions);
  });

  addFunction = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid Syntax' });

    const result = validatePartialMovie(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: JSON.parse(result.error.message) });
    }

    const { functions } = result.data;
    if (!functions?.length) {
      return res.status(400).json({ message: 'Function is required' });
    }

    const updatedMovie = await this.movieModel.addFunction({
      movieId: id,
      input: functions,
    });

    if (!updatedMovie) {
      return res
        .status(404)
        .json({ message: 'The function could not be added' });
    }

    return res.json(updatedMovie);
  });

  deleteFunction = asyncHandler(async (req: Request, res: Response) => {
    const { id, functionId } = req.params;
    if (!id || !functionId)
      return res.status(400).json({ message: 'Invalid Syntax' });

    const updatedMovie = await this.movieModel.deleteFunction({
      movieId: id,
      functionId,
    });

    if (!updatedMovie) {
      return res
        .status(404)
        .json({ message: 'The function could not be deleted' });
    }

    return res.json(updatedMovie);
  });

  listAvailableSeats = asyncHandler(async (req: Request, res: Response) => {
    const { id, functionId } = req.params;
    if (!id || !functionId)
      return res.status(400).json({ message: 'Invalid Syntax' });

    const availableSeats = await this.movieModel.getAvailableSeats({
      movieId: id,
      functionId,
    });

    if (!availableSeats) {
      return res
        .status(404)
        .json({ message: 'The function could not be found' });
    }

    return res.json(availableSeats);
  });

  reserveSeats = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { functionId, seats } = req.body;

    if (!id || !functionId || !Array.isArray(seats) || !seats.length) {
      return res
        .status(400)
        .json({ message: 'FunctionId and seats are required' });
    }

    const updatedMovie = await this.movieModel.reserveSeat({
      movieId: id,
      functionId,
      seats,
    });

    if (!updatedMovie) {
      return res
        .status(404)
        .json({ message: 'The seat could not be reserved' });
    }

    return res.json(updatedMovie);
  });
}
