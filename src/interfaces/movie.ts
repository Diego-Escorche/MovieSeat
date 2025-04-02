import { Types } from 'mongoose';

export interface Seat {
  seatNumber: string;
  isAvailable: boolean;
}

export interface MovieFunction extends Types.Subdocument {
  _id: Types.ObjectId;
  datetime: Date;
  seats: Seat[];
}

export interface MovieFunctionUpdate {
  datetime: string;
  newDatetime: string;
}

export interface FunctionInput {
  datetime: string;
}

export interface IMovie {
  _id: string;
  title: string;
  year: number;
  director: string;
  duration: number;
  poster: string;
  genre: string[];
  rate: number;
  functions: MovieFunction[];
}
