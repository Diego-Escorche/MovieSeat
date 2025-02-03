const express = require('express');
const app = express();
const crypto = require('crypto'); // For unique ID generation

const moviesJSON = require('./movies.json');
const { validateMovie } = require('./schemas/moviesSchema');

app.use(express.json());
app.disable('x-powered-by');

const PORT = process.env.PORT || 1234;

// Movies by genre & by default all the movies available
app.get('/movies', (req, res) => {
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
    // Library that lets you create a new id. UUID = Universal unique identifier
    id: crypto.randomUUID(),
    ...result.data,
  };

  moviesJSON.push(newMovie);

  res.status(201).json(newMovie);
});
app.listen(PORT, () => {
  console.log(`listening on port: http://localhost:${PORT}`);
});
