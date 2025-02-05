const express = require('express');
const crypto = require('crypto'); // For unique ID generation

const moviesJSON = require('./movies.json');
const {
  validateMovie,
  validatePartialMovie,
} = require('./schemas/moviesSchema');

const app = express();
app.use(express.json());
app.disable('x-powered-by');

// Common Methods for CORS: GET/HEAD/POST
// Complex Methods for CORS: PUT/PATCH/DELETE -> They use CORS PRE-Flight or Options
const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:1234',
  'https://movies.com',
];

// Movies by genre & by default all the movies available
app.get('/movies', (req, res) => {
  const origin = req.header('origin');

  // When the request is from the same origin, it isn't sent on the request header.
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    // res.header('Access-Control-Allow-Origin', '*') => Allow Access to every Port (Not recommended, it can cause a security breach). '*' means all available ports.
    res.header('Access-Control-Allow-Origin', origin);
  }

  const { genre } = req.query;
  if (genre) {
    const filteredMovies = moviesJSON.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase()),
    );

    return res.json(filteredMovies);
  }

  return res.json(moviesJSON);
});

// Movies by Id
app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movie = moviesJSON.find((movie) => movie.id === id);

  if (movie) {
    return res.json(movie);
  }

  return res.status(404).json({ message: 'Movie not found' });
});

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    // It could also be used the 422 error message.
    return res.status(400).json({ message: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(), // Creates the Universal Unique ID
    ...result.data, // Gets the validated data
  };

  moviesJSON.push(newMovie);

  res.status(201).json(newMovie);
});

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ message: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = moviesJSON.findIndex((m) => m.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  const updateMovie = {
    ...moviesJSON[movieIndex],
    ...result.data,
  };

  moviesJSON[movieIndex] = updateMovie;
  return res.json(updateMovie);
});

app.delete('/movies/:id', (req, res) => {
  const origin = req.header('origin');
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const { id } = req.params;
  const movieIndex = moviesJSON.find((m) => m.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ Error: 'Movie not found' });
  }

  moviesJSON.splice(movieIndex, 1);

  return res.status(204).json({ message: 'Movie deleted successfully' });
});

app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin');

  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // To allow access to the methods.
  }
  res.send();
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`listening on port: http://localhost:${PORT}`);
});
