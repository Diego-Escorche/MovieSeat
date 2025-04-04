/**
 * @fileoverview MovieModel handles all database operations related to movies.
 * This includes creating, reading, updating, and deleting movies, as well as managing
 * nested movie functions (showtimes), seat availability, and reservation logic.
 */

import { Movie } from '../models/movie.js';
import { randomUUID } from 'crypto';
import { generateSeats } from '../utils.js';
import {
  IMovie,
  FunctionInput,
  MovieFunctionUpdate,
  MovieFunction,
  Seat,
} from '../interfaces/movie.js';

export class MovieModel {
  static async getAll({ genre }: { genre?: string }) {
    const query = genre
      ? {
          genre: { $elemMatch: { $regex: new RegExp(genre, 'i') } },
        }
      : {};

    return await Movie.find(query).catch((err) => console.log(err));
  }

  static async getById({ id }: { id: string }) {
    return await Movie.findById(id).catch((err) => console.log(err));
  }

  static async create({ input }: { input: Omit<IMovie, '_id' | 'functions'> }) {
    const newMovie = new Movie({
      _id: randomUUID(),
      ...input,
    });

    await newMovie.save().catch((err) => console.log(err));
    return newMovie;
  }

  static async delete({ id }: { id: string }) {
    return await Movie.findByIdAndDelete(id).catch((err) => console.log(err));
  }

  static async update({
    id,
    input,
  }: {
    id: string;
    input: Partial<IMovie> & { updates?: MovieFunctionUpdate[] };
  }) {
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

  static async getFunctions({ movieId }: { movieId: string }) {
    const movie = await Movie.findById(movieId);
    if (!movie) return null;
    return movie.functions;
  }

  static async addFunction({
    movieId,
    input,
  }: {
    movieId: string;
    input: FunctionInput[];
  }) {
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

  static async updateFunction({
    movie,
    updates,
  }: {
    movie: any;
    updates: MovieFunctionUpdate[];
  }) {
    if (!movie || !Array.isArray(updates)) return null;

    for (const { datetime, newDatetime } of updates) {
      const target = movie.functions.find(
        (f: MovieFunction) =>
          f.datetime.getTime() === new Date(datetime).getTime(),
      );

      if (target && newDatetime) {
        target.datetime = new Date(newDatetime);
      }
    }

    await movie.save();
    return movie;
  }

  static async deleteFunction({
    movieId,
    functionId,
  }: {
    movieId: string;
    functionId: string;
  }) {
    const movie = await Movie.findById(movieId);
    if (!movie) return null;

    movie.functions.pull(functionId);

    await movie.save();
    return movie;
  }

  static async getAvailableSeats({
    movieId,
    functionId,
  }: {
    movieId: string;
    functionId: string;
  }) {
    const movie = await Movie.findById(movieId);
    if (!movie) return null;

    const func = movie.functions.find(
      (f: MovieFunction) => f._id.toString() === functionId,
    );
    if (!func) return null;

    const availableSeats = func.seats.filter((seat: Seat) => seat.isAvailable);
    return availableSeats;
  }

  static async reserveSeat({
    movieId,
    functionId,
    seats,
  }: {
    movieId: string;
    functionId: string;
    seats: string[];
  }) {
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
