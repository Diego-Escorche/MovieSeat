import { Movie } from './mongodb/DBBroker.js';
import { randomUUID } from 'crypto';

export class MovieModel {
  static async getAll({ genre }) {
    let movies;

    if (genre) {
      movies = await Movie.find({
        genre: { $regex: new RegExp(genre, 'i') },
      }).toArray();

      return movies;
    }

    movies = await Movie.find({}).toArray();
    return movies;
  }

  static async getById({ id }) {
    const movie = await Movie.findOne({ _id: id });
    return movie;
  }

  static async create({ input }) {
    const newMovie = new Movie({
      _id: randomUUID(),
      ...input,
    });

    await newMovie.save().catch((err) => console.log(err));
    return newMovie;
  }

  static async delete({ id }) {
    const deletedMovie = await Movie.findByIdAndDelete({ _id: id }).catch(
      (err) => console.log(err),
    );

    return !deletedMovie ? false : true;
  }

  static async update({ id, input }) {
    const updatedMovie = await Movie.findByIdAndUpdate({ _id: id }, input, {
      new: true,
    }).catch((err) => console.log(err));

    return updatedMovie;
  }
}
