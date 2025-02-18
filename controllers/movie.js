import {
  validateMovie,
  validatePartialMovie,
} from '../schemas/moviesSchema.js';
import { MovieModel } from '../models/movie.js';

export class MovieController {
  static async getAll(req, res) {
    const { genre } = req.query;
    const movies = await MovieModel.getAll({ genre });
    return res.json(movies);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const movie = await MovieModel.getById({ id });

    if (movie) return res.json(movie);
    return res.status(404).json({ message: 'Movie not found' });
  }

  static async create(req, res) {
    const result = validateMovie(req.body);
    if (result.error) {
      // It could also be used the 422 error message.
      return res
        .status(400)
        .json({ message: JSON.parse(result.error.message) });
    }

    const newMovie = await MovieModel.create(result.data);
    res.status(201).json(newMovie);
  }

  static async delete(req, res) {
    const { id } = req.params;
    const check = await MovieModel.delete({ id });

    if (check === false) {
      return res
        .status(400)
        .json({ message: 'Movie could not be deleted by an unknown error' });
    } else {
      return res.json({ message: 'Movie deleted successfully' });
    }
  }

  static async update(req, res) {
    const result = validatePartialMovie(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json({ message: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    const updatedMovie = await MovieModel.update({ id, input: result.data });
    return res.json(updatedMovie);
  }
}
