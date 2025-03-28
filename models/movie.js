/**
 * @fileoverview MovieModel handles all database operations related to movies.
 * This includes creating, reading, updating, and deleting movies, as well as managing
 * nested movie functions (showtimes), seat availability, and reservation logic.
 */

import { Movie } from './mongodb/DBBroker.js';
import { randomUUID } from 'crypto';

export class MovieModel {
  /**
   * Retrieves all movies, optionally filtering by genre (case-insensitive).
   * @param {*} param0 Object containing optional genre string to filter.
   * @returns {Promise<Array>} A list of matching movies.
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
   * Retrieves a movie by its unique ID.
   * @param {*} param0 Object containing the movie ID.
   * @returns {Promise<Object|null>} The found movie or null.
   */
  static async getById({ id }) {
    return await Movie.findById(id).catch((err) => console.log(err));
  }

  /**
   * Creates and stores a new movie in the database.
   * @param {*} param0 Object containing the movie data.
   * @returns {Promise<Object|null>} The newly created movie or null.
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
   * Deletes a movie by its ID.
   * @param {*} param0 Object containing the movie ID.
   * @returns {Promise<Object|null>} The deleted movie or null.
   */
  static async delete({ id }) {
    return await Movie.findByIdAndDelete(id).catch((err) => console.log(err));
  }

  /**
   * Updates a movie by its ID, optionally updating nested functions as well.
   * @param {*} param0 Object containing the movie ID and input data.
   * @returns {Promise<Object|null>} The updated movie or null.
   */
  static async update({ id, input }) {
    const { updates, ...movieFields } = input;

    let updatedMovie = await Movie.findByIdAndUpdate(id, movieFields, {
      new: true,
    }).catch((err) => console.log(err));
    if (!updatedMovie) return null;

    if (updates?.length) {
      updatedMovie = await this.updateFunction({
        movie: updatedMovie,
        updates: updates,
      });
    }

    return updatedMovie;
  }

  /**
   * Retrieves all functions (showtimes) of a specific movie.
   * @param {*} param0 Object containing the movieId
   * @returns An array of functions if the movie exists, otherwise null
   */
  static async getFunctions({ movieId }) {
    const movie = await Movie.findById(movieId);
    if (!movie) return null;
    return movie.functions;
  }

  /**
   * Adds new functions (showtimes) to an existing movie.
   * @param {*} param0 Object containing the movieId and an array of function objects with datetime.
   * @returns {Promise<Object|null>} The updated movie or null.
   */
  static async addFunction({ movieId, input }) {
    const movie = await Movie.findById(movieId);
    if (!movie) return null;

    input.forEach(({ datetime }) => {
      movie.functions.push({
        datetime: new Date(datetime),
        seats: generateSeats(),
      });
    });

    await movie.save();
    return movie;
  }

  /**
   * Updates the datetime of existing functions for a movie.
   * @param {*} param0 Object containing the movie and an array of updates: { datetime, newDatetime }.
   * @returns {Promise<Object|null>} The updated movie or null.
   */
  static async updateFunction({ movie, updates }) {
    if (!movie || !Array.isArray(updates)) return null;

    for (const { datetime, newDatetime } of updates) {
      const target = movie.functions.find(
        (f) => f.datetime.getTime() === new Date(datetime).getTime(),
      );

      if (target && newDatetime) {
        target.datetime = new Date(newDatetime);
      }
    }

    await movie.save();
    return movie;
  }

  /**
   * Deletes a specific function (showtime) from a movie.
   * @param {*} param0 Object containing the movieId and functionId.
   * @returns {Promise<Object|null>} The updated movie or null.
   */
  static async deleteFunction({ movieId, functionId }) {
    const movie = await Movie.findById(movieId);
    if (!movie) return null;

    movie.functions = movie.functions.filter(
      (f) => f._id.toString() !== functionId,
    );

    await movie.save();
    return movie;
  }

  /**
   * Retrieves all available seats for a specific function.
   * @param {*} param0 Object containing the movieId and functionId.
   * @returns {Promise<Array|null>} List of available seats or null.
   */
  static async getAvailableSeats({ movieId, functionId }) {
    const movie = await Movie.findById(movieId);
    if (!movie) return null;

    const func = movie.functions.id(functionId);
    if (!func) return null;

    const availableSeats = func.seats.filter((seat) => seat.isAvailable);
    return availableSeats;
  }

  /**
   * Reserves a group of seats in a function, only if they are all available.
   * @param {*} param0 Object containing movieId, functionId, and an array of seat numbers.
   * @returns {Promise<Object|null>} The updated movie document or null.
   */
  static async reserveSeat({ movieId, functionId, seats }) {
    return await Movie.findOneAndUpdate(
      {
        _id: movieId,
        functions: {
          $elemMatch: {
            _id: functionId,
            seats: {
              $all: seats.map((seatNumber) => ({
                $elemMatch: {
                  seatNumber,
                  isAvailable: true,
                },
              })),
            },
          },
        },
      },
      {
        $set: {
          'functions.$[func].seats.$[seat].isAvailable': false,
        },
      },
      {
        arrayFilters: [
          { 'func._id': functionId },
          { 'seat.seatNumber': { $in: seats } },
        ],
        new: true,
      },
    );
  }
}
