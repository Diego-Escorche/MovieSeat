import { readJSON } from '../utils.js';
const movies = readJSON('../movies.json');

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      return movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase()),
      );
    }
    return movies;
  }
  static async getById({ id }) {
    const movie = movies.find((movie) => movie.id === id);
    return movie;
  }
}
