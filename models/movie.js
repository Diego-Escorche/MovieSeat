import { Movie } from './mongodb/DBBroker.js';
import { randomUUID } from 'crypto';

export class MovieModel {
  /**
   * Retrieves all movies from the database.
   * @param {*} param0 Object that contains the genre to filter the movies.
   * @returns An array with all the movies
   */
  static async getAll({ genre }) {
    const query = genre
      ? {
          genre: { $elemMatch: { $regex: new RegExp(genre, 'i') } },
        }
      : {};

    return await Movie.find(query).catch((err) => console.log(err));
  }

  /**
   * Looks for a movie by its id.
   * @param {*} param0 Object that contains the movie id.
   * @returns The movie object if it exists, otherwise null.
   */
  static async getById({ id }) {
    return await Movie.findById(id).catch((err) => console.log(err));
  }

  /**
   * Stores a user in the database and creates an id.
   * @param {*} param0 Object that contains the movie data.
   * @returns The movie object if it was created, otherwise null.
   */
  static async create({ input }) {
    const newMovie = new Movie({
      _id: randomUUID(),
      ...input,
    });

    await newMovie.save().catch((err) => console.log(err));

    return newMovie;
  }

  /**
   * Searches for a movie by its id and deletes it.
   * @param {*} param0 Object containing the movie id.
   * @returns True if the movie was deleted, otherwise null.
   */
  static async delete({ id }) {
    return await Movie.findByIdAndDelete(id).catch((err) => console.log(err));
  }

  /**
   * Looks a movie by its id, updates it and returns the updated movie.
   * @param {*} param0 Object that contains the movie id and its data.
   * @returns The updated movie object if it was updated, otherwise null.
   */
  static async update({ id, input }) {
    return await Movie.findByIdAndUpdate(id, input, {
      new: true,
    }).catch((err) => console.log(err));
  }
}
