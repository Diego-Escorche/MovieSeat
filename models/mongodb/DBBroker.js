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
const movieSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
});

export const Movie = mongoose.model('Movie', movieSchema);
