import { disconnect } from 'process';
import { connectDB, disconnectDB, Movie } from './mongodb/DBBroker';
import { randomUUID } from 'crypto';

export class MovieModel {
  static async getAll({ genre }) {
    await connectDB;

    let movies;

    if (genre) {
      movies = await Movie.find({ genre: { $regex: new RegExp(genre, 'i') } });
      return movies;
    }

    movies = await Movie.find({});
    await disconnectDB;

    return movies;
  }

  static async getById({ id }) {
    await connectDB;

    const movie = Movie.findById(id);

    await disconnectDB;

    return movie;
  }

  static async create({ input }) {
    await connectDB;

    const newMovie = new Movie({
      _id: randomUUID(),
      ...input,
    });

    await newMovie.save();
    await disconnectDB;

    return newMovie;
  }

  static async delete({ id }) {
    await connectDB;

    const deletedMovie = await Movie.findByIdAndDelete(id);

    await disconnectDB;

    return !deletedMovie ? false : true;
  }

  static async update({ id, input }) {
    await connectDB;

    const updatedMovie = await Movie.findByIdAndUpdate(id, input, {
      new: true,
    });

    await disconnectDB;

    return updatedMovie;
  }
}
