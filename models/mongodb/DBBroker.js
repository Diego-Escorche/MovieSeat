import mongoose from 'mongoose';
import { ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// Allow debug
mongoose.set('debug', true);

//---------------------------------------

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'MovieSeat',
      serverApi: {
        version: ServerApiVersion.v1,
        moderate: true,
        deprecationErrors: true,
      },
    });
    console.log(`Connected to the database ${mongoose.connection.name}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); // Exit the process if the connection fails
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected successfully from the database');
  } catch (error) {
    console.error('Error disconnecting from the database', error);
  }
}

// ---------------------- SCHEMAS ----------------------

const { Schema } = mongoose;

const userSchema = new Schema({
  _id: { type: String, unique: true },
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: [String], default: ['user'] },
});

const seatSchema = new Schema({
  seatNumber: { type: String },
  isAvailable: { type: Boolean, default: true },
});

const functionSchema = new Schema({
  date: { type: Date },
  time: { type: String },
  seats: [seatSchema],
});

const movieSchema = new Schema({
  _id: { type: String, unique: true },
  title: { type: String },
  year: { type: Number },
  director: { type: String },
  duration: { type: Number },
  poster: { type: String },
  genre: { type: [String] },
  rate: { type: Number },
  functions: { type: [functionSchema], default: [] },
});

const reservationSchema = new Schema({
  _id: { type: String, unique: true },
  user: { type: String },
  movie: { type: String },
  functionId: { type: String },
  seats: [{ type: String }],
  createdAt: { type: Date },
});

export const Movie = mongoose.model('Movie', movieSchema);
export const User = mongoose.model('User', userSchema);
export const Reservation = mongoose.model('Reservation', reservationSchema);
