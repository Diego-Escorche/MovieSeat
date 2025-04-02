import mongoose, { Schema, Document, Types } from 'mongoose';
import { MovieFunction, Seat } from '../interfaces/movie.js';

export interface Movie extends Document {
  _id: string;
  title: string;
  year: number;
  director: string;
  duration: number;
  poster: string;
  genre: string[];
  rate: number;
  functions: Types.DocumentArray<MovieFunction>;
}

const seatSchema = new Schema<Seat>(
  {
    seatNumber: { type: String, required: true },
    isAvailable: { type: Boolean, required: true },
  },
  { _id: false },
);

const functionSchema = new Schema<MovieFunction>(
  {
    datetime: { type: Date, required: true },
    seats: { type: [seatSchema], default: [] },
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
    functions: { type: [functionSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

export const Movie = mongoose.model<Movie>('Movie', movieSchema);
