const express = require('express');
const moviesJSON = require('./movies.json');
const app = express();
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

app.listen(PORT, () => {
  console.log(`listening on port: http://localhost:${PORT}`);
});
