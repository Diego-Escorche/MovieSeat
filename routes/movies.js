import { Router } from 'express';
import { randomUUID } from 'crypto';
import {
  validateMovie,
  validatePartialMovie,
} from '../schemas/moviesSchema.js';
import { MovieModel } from '../views/movie.js';
// Read a JSON with ESModules
import { readJSON } from '../utils.js';
const movies = readJSON('../movies.json');

export const moviesRouter = Router();

moviesRouter.get('/', async (req, res) => {
  const { genre } = req.query;
  const movies = await MovieModel.getAll({ genre });
  return res.json(movies);
});

moviesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const movie = await MoviesModel.getById({ id });

  if (movie) {
    return res.json(movie);
  }

  return res.status(404).json({ message: 'Movie not found' });
});

moviesRouter.post('/', (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    // It could also be used the 422 error message.
    return res.status(400).json({ message: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: randomUUID(), // Creates the Universal Unique ID
    ...result.data, // Gets the validated data
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
});

moviesRouter.patch('/:id', (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ message: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((m) => m.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;
  return res.json(updateMovie);
});

moviesRouter.delete('/:id', (req, res) => {
  const origin = req.header('origin');
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const { id } = req.params;
  const movieIndex = movies.find((m) => m.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ Error: 'Movie not found' });
  }

  movies.splice(movieIndex, 1);

  return res.status(204).json({ message: 'Movie deleted successfully' });
});
