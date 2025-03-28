import {
  validateMovie,
  validatePartialMovie,
} from '../schemas/moviesSchema.js';
import { asyncHandler } from '../utils.js';

export class MovieController {
  constructor({ movieModel }) {
    this.movieModel = movieModel;
  }

  getAll = asyncHandler(async (req, res) => {
    const { genre } = req.query;
    const movies = await this.movieModel.getAll({
      ...(genre && { genre: genre }),
    });

    return res.json(movies);
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid Syntax' });

    const movie = await this.movieModel.getById({ id });

    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    return res.json(movie);
  });

  create = asyncHandler(async (req, res) => {
    const result = validateMovie(req.body);

    if (result.error) {
      // It could also be used the 422 error message.
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

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid Syntaxis' });

    const deleted = await this.movieModel.delete({ id });

    if (!deleted) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    return res.json({ message: 'Movie deleted successfully' });
  });

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
      id: id,
      input: result.data,
    });

    if (!updatedMovie)
      return res.status(500).json({ message: 'Movie could not be updated' });

    return res.json(updatedMovie);
  });

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

  deleteFunction = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid Syntaxis' });

    const { functionId } = req.body;
    if (!functionId) {
      return res.status(400).json({ message: 'FunctionId is required' });
    }

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

  getAvailableSeats = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Invalid Syntaxis' });

    const { functionId } = req.body;
    if (!functionId) {
      return res.status(400).json({ message: 'FunctionId is required' });
    }

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
}
