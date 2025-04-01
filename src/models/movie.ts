import mongoose, { Schema, Document } from 'mongoose';
import { MovieFunction, Seat } from '../interfaces/movie.js';

export interface Movie extends Document {
  title: string;
  year: number;
  director: string;
  duration: number;
  poster: string;
  genre: string[];
  rate: number;
  functions: MovieFunction[];
}

const seatSchema = new Schema<Seat>(
  {
    seatNumber: String,
    isAvailable: Boolean,
  },
  { _id: false },
);

const functionSchema = new Schema<MovieFunction>(
  {
    datetime: Date,
    seats: [seatSchema],
  },
  { _id: true },
);

const movieSchema = new Schema<Movie>(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    year: Number,
    director: String,
    duration: Number,
    poster: String,
    genre: [String],
    rate: Number,
    functions: [functionSchema],
  },
  {
    timestamps: true,
  },
);

export const Movie = mongoose.model<Movie>('Movie', movieSchema);
