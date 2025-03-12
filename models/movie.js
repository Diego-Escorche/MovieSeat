import { Movie } from './mongodb/DBBroker.js';
import { randomUUID } from 'crypto';

export class MovieModel {
  static async getAll({ genre }) {
    let movies;

    if (genre) {
      movies = await Movie.find({
        genre: { $elemMatch: { $regex: new RegExp(genre, 'i') } },
      }).catch((err) => console.log(err));

      return movies;
    }

    movies = await Movie.find({}).catch((err) => console.log(err));
    return movies;
  }

  /**
   * Looks for a movie by its id.
   * @param {*} param0 Object that contains the movie id.
   * @returns The movie object if it exists, otherwise null.
   */
  static async getById({ id }) {
    const movie = await Movie.findById(id).catch((err) => {
      console.log(err);
      return null;
    });

    return movie;
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

    await newMovie.save().catch((err) => {
      console.log(err);
      return null;
    });

    return newMovie;
  }

  /**
   * Searches for a movie by its id and deletes it.
   * @param {*} param0 Object containing the movie id.
   * @returns True if the movie was deleted, otherwise false.
   */
  static async delete({ id }) {
    await Movie.findByIdAndDelete({ _id: id }).catch((err) => {
      console.log(err);
      return false;
    });

    return true;
  }

  /**
   * Looks a movie by its id, updates it and returns the updated movie.
   * @param {*} param0 Object that contains the movie id and its data.
   * @returns The updated movie object if it was updated, otherwise null.
   */
  static async update({ id, input }) {
    const updatedMovie = await Movie.findByIdAndUpdate({ _id: id }, input, {
      new: true,
    }).catch((err) => {
      console.log(err);
      return null;
    });

    return updatedMovie;
  }
}
