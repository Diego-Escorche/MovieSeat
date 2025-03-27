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

  // ----------- FUNCTION METHODS -------------
  /**
   *
   * @param {*} param0 An object that contains the movieId and the input data.
   * The input format needs to be like this: 
   * [
      { "datetime": "2024-03-25T21:00:00Z" },
      { "datetime": "2024-03-26T01:30:00Z" }
     ]
   * @returns The updated array with the new function.
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
   *
   * @param {*} param0 An Object that contains the movie, and the datetime updates on the update parameter.
   * @returns An updated array with the function that was updated.
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
   *
   * @param {*} param0 An Object that contains the movieId and the functionId.
   * @returns An updated array without the function that was deleted.
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
   *
   * @param {*} param0 An Object with the movieId and functionId.
   * @returns An array with all the available seats of a function
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
   * Reserves a seat only if the function
   * is found and if the seat is available.
   * @param {*} param0 Object containing the ids of the movie, function and the seats.
   * @returns The updated seat if all the conditions where met, otherwise it returns a null.
   */
  static async reserveSeat({ movieId, functionId, seats }) {
    const seatUpdated = await Movie.findOneAndUpdate(
      {
        _id: movieId,
        'functions._id': functionId,
        $and: seats.map((seatNumber) => ({
          'functions.seats': {
            $elemMatch: {
              seatNumber,
              isAvailable: true,
            },
          },
        })),
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

    return seatUpdated;
  }
}
