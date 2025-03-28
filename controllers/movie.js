/**
 * @fileoverview Controller for handling movie-related requests.
 * Supports full CRUD operations for movies, managing showtime functions,
 * and reserving or listing available seats.
 */

import {
  validateMovie,
  validatePartialMovie,
} from '../schemas/moviesSchema.js';
import { asyncHandler } from '../utils.js';

export class MovieController {
  constructor({ movieModel }) {
    this.movieModel = movieModel;
  }

  //--------------------- MOVIES ---------------------
  /**
   * Gets all movies or filters by genre if provided.
   * @route GET /movies
   * @query {string} genre - Optional genre filter
   */
  getAll = asyncHandler(async (req, res) => {
    const { genre } = req.query;
    const movies = await this.movieModel.getAll({
      ...(genre && { genre }),
    });

    return res.json(movies);
  });

  /**
   * Gets a movie by its ID.
   * @route GET /movies/:id
   * @param {string} id - Movie ID
   */
  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid Syntax' });

    const movie = await this.movieModel.getById({ id });

    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    return res.json(movie);
  });

  /**
   * Creates a new movie, with optional functions.
   * @route POST /movies
   * @body {Movie} movie object
   */
  create = asyncHandler(async (req, res) => {
    const result = validateMovie(req.body);
    if (result.error) {
      return res
        .status(400)
        .json({ message: JSON.parse(result.error.message) });
    }

    const { functions, ...movieData } = result.data;

    let newMovie = await this.movieModel.create({ input: movieData });
    if (!newMovie) {
      return res.status(500).json({ message: 'Movie could not be created' });
    }

    if (functions?.length) {
      newMovie = await this.movieModel.addFunction({
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

  /**
   * Deletes a movie by its ID.
   * @route DELETE /movies/:id
   */
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid Syntaxis' });

    const deleted = await this.movieModel.delete({ id });

    if (!deleted) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    return res.json({ message: 'Movie deleted successfully' });
  });

  /**
   * Updates a movie and optionally its functions.
   * @route PATCH /movies/:id
   * @body {Partial<Movie>} updated movie data
   */
  update = asyncHandler(async (req, res) => {
    const result = validatePartialMovie(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json({ message: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid Syntaxis' });

    const updatedMovie = await this.movieModel.update({
      id,
      input: result.data,
    });

    if (!updatedMovie)
      return res.status(500).json({ message: 'Movie could not be updated' });

    return res.json(updatedMovie);
  });

  // ------------------ FUNCTIONS -----------------------

  /**
   * Gets all functions (showtimes) for a specific movie.
   * @route GET /movies/:id/functions
   */
  getAllFunctions = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid Syntaxis' });

    const functions = await this.movieModel.getAllFunctions({ movieId: id });

    if (!functions) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    return res.json(functions);
  });

  /**
   * Adds one or more functions (showtimes) to an existing movie.
   * @route POST /movies/:id/functions
   */
  addFunction = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid Syntaxis' });

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

  /**
   * Deletes a specific function (showtime) from a movie.
   * @route DELETE /movies/:id/functions/:functionId
   * @body {string} functionId
   */
  deleteFunction = asyncHandler(async (req, res) => {
    const { id, functionId } = req.params;
    if (!id || !functionId)
      return res.status(400).json({ message: 'Invalid Syntaxis' });

    const updatedMovie = await this.movieModel.deleteFunction({
      movieId: id,
      functionId: functionId,
    });

    if (!updatedMovie) {
      return res
        .status(404)
        .json({ message: 'The function could not be deleted' });
    }

    return res.json(updatedMovie);
  });

  // ------------------- SEATS --------------------------
  /**
   * Retrieves available seats from a specific function.
   * @route GET /movies/:id/functions/:functionId/seats
   * @body {string} functionId
   */
  listAvailableSeats = asyncHandler(async (req, res) => {
    const { id, functionId } = req.params;
    if (!id || !functionId)
      return res.status(400).json({ message: 'Invalid Syntaxis' });

    const availableSeats = await this.movieModel.getAvailableSeats({
      movieId: id,
      functionId: functionId,
    });

    if (!availableSeats) {
      return res
        .status(404)
        .json({ message: 'The function could not be found' });
    }

    return res.json(availableSeats);
  });

  /**
   * Reserves one or more seats for a movie function.
   * @route POST /movies/:id/reserve
   * @body {string} functionId, {string[]} seats
   */
  reserveSeats = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid Syntaxis' });

    const { functionId, seats } = req.body;
    if (!functionId || !seats?.length) {
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
