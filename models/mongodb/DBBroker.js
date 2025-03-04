import mongoose from 'mongoose';
import { ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

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
        strict: true,
        deprecationErrors: true,
      },
    });
    console.log(`Connected to the database ${mongoose.connection.name}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); // Salir del proceso con error
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

const { Schema } = mongoose;

const seatSchema = new Schema({
  seatNumber: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
});

const functionSchema = new Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  seats: [seatSchema],
});

const movieSchema = new Schema({
  _id: { type: String, default: randomUUID(), unique: true },
  title: { type: String, required: true },
  year: { type: Number, required: true },
  director: { type: String, required: true },
  duration: { type: Number, required: true },
  poster: { type: String, required: true },
  genre: { type: [String], required: true },
  rate: { type: Number, required: true },
  functions: { type: [functionSchema], default: [] },
});

const userSchema = new Schema({
  _id: { type: String, default: randomUUID() },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: [String], default: ['user'] },
});

export const Movie = mongoose.model('Movie', movieSchema);
export const User = mongoose.model('User', userSchema);
