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
    let movies;

    if (genre) {
      movies = await this.movieModel.getAll({ genre: genre });
    } else {
      movies = await this.movieModel.getAll({});
    }

    return res.json(movies);
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const movie = await this.movieModel.getById({ id });

    if (movie) return res.json(movie);
    res.status(404).json({ message: 'Movie not found' });
  });

  create = asyncHandler(async (req, res) => {
    const result = validateMovie(req.body);
    if (result.error) {
      // It could also be used the 422 error message.
      return res
        .status(400)
        .json({ message: JSON.parse(result.error.message) });
    }

    const newMovie = await this.movieModel.create({ input: result.data });

    if (newMovie) {
      return res.status(201).json(newMovie);
    }

    res.status(500).json({ message: 'Movie could not be created' });
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const check = await this.movieModel.delete({ id });

    if (check) {
      return res.json({ message: 'Movie deleted successfully' });
    }

    res
      .status(500)
      .json({ message: 'Movie could not be deleted by an unknown error' });
  });

  update = asyncHandler(async (req, res) => {
    const result = validatePartialMovie(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json({ message: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    const updatedMovie = await this.movieModel.update({
      id: id,
      input: result.data,
    });

    if (updatedMovie) return res.json(updatedMovie);

    res.status(500).json({ message: 'Movie could not be updated' });
  });
}
