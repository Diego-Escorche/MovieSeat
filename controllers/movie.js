import {
  validateMovie,
  validatePartialMovie,
} from '../schemas/moviesSchema.js';

export class MovieController {
  constructor({ movieModel }) {
    this.movieModel = movieModel;
  }

  getAll = async (req, res) => {
    const { genre } = req.query;
    const movies = await this.movieModel.getAll({ genre });
    return res.json(movies);
  };

  getById = async (req, res) => {
    const { id } = req.params;
    const movie = await this.movieModel.getById({ id });

    if (movie) return res.json(movie);
    res.status(404).json({ message: 'Movie not found' });
  };

  create = async (req, res) => {
    const result = validateMovie(req.body);
    if (result.error) {
      // It could also be used the 422 error message.
      return res
        .status(400)
        .json({ message: JSON.parse(result.error.message) });
    }

    const newMovie = await this.movieModel.create({ input: result.data });
    res.status(201).json(newMovie);
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const check = await this.movieModel.delete({ id });

    if (check === false) {
      return res
        .status(400)
        .json({ message: 'Movie could not be deleted by an unknown error' });
    } else {
      return res.json({ message: 'Movie deleted successfully' });
    }
  };

  update = async (req, res) => {
    const result = validatePartialMovie(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json({ message: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    const updatedMovie = await this.movieModel.update({
      id,
      input: result.data,
    });
    return res.json(updatedMovie);
  };
}
