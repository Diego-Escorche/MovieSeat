import { Movie } from './mongodb/DBBroker.js';
import { generateSeats } from '../utils.js';

export class FunctionModel {
  /**
   *
   * @param {*} param0 An object that contains the movieId and the input data.
   * @returns The updated array with the new function.
   */
  static async addFunction({ movieId, input }) {
    const movie = await Movie.findById(movieId);
    if (!movie) return null;

    // Generate all the seats for the function
    const { datetime } = input;
    movie.functions.push({
      datetime: datetime,
      seats: generateSeats(),
    });

    await movie.save();
    return movie;
  }

  /**
   *
   * @param {*} param0 An Object that contains the movieId, functionId and the input data.
   * @returns An updated array with the function that was updated.
   */
  static async updateFunction({ movieId, functionId, input }) {
    const movie = await Movie.findById(movieId);
    if (!movie) return null;

    const func = movie.functions.id(functionId);
    if (!func) return null;

    // Updates the function with the data passed by the input
    Object.assign(func, input);
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
        'functions.seats.seatNumber': { $all: seats },
        'functions.seats.isAvailable': true,
      },
      { $set: { 'functions.$[].seats.$[seat].isAvailable': false } },
      { arrayFilters: [{ 'seat.seatNumber': { $in: seats } }], new: true },
    );

    return seatUpdated;
  }
}
