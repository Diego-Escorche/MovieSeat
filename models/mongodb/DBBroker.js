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

    // Check if the users collection exists
    const userCollections = await mongoose.connection.db
      .listCollections({ name: 'users' })
      .toArray();
    if (userCollections.length === 0) {
      // Create the users collection with schema validation
      await mongoose.connection.db.createCollection('users', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['email', 'username', 'password', 'role'],
            properties: {
              email: {
                bsonType: 'string',
                description: 'must be a string and is required',
              },
              username: {
                bsonType: 'string',
                description: 'must be a string and is required',
              },
              password: {
                bsonType: 'string',
                description: 'must be a string and is required',
              },
              role: {
                bsonType: 'array',
                items: {
                  bsonType: 'string',
                },
                description: 'must be an array of strings and is required',
              },
            },
          },
        },
        validationLevel: 'strict',
        validationAction: 'error',
      });
      console.log('Users collection created with schema validation');
    } else {
      console.log('Users collection already exists');
    }

    // Check if the movies collection exists
    const movieCollections = await mongoose.connection.db
      .listCollections({ name: 'movies' })
      .toArray();
    if (movieCollections.length === 0) {
      // Create the movies collection with schema validation
      await mongoose.connection.db.createCollection('movies', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: [
              'title',
              'year',
              'director',
              'duration',
              'poster',
              'genre',
              'rate',
              'functions',
            ],
            properties: {
              title: {
                bsonType: 'string',
                description: 'must be a string and is required',
              },
              year: {
                bsonType: 'int',
                description: 'must be an integer and is required',
              },
              director: {
                bsonType: 'string',
                description: 'must be a string and is required',
              },
              duration: {
                bsonType: 'int',
                description: 'must be an integer and is required',
              },
              poster: {
                bsonType: 'string',
                description: 'must be a string and is required',
              },
              genre: {
                bsonType: 'array',
                items: {
                  bsonType: 'string',
                },
                description: 'must be an array of strings and is required',
              },
              rate: {
                bsonType: 'int',
                description: 'must be an integer and is required',
              },
              functions: {
                bsonType: 'array',
                items: {
                  bsonType: 'object',
                  required: ['date', 'time', 'seats'],
                  properties: {
                    date: {
                      bsonType: 'date',
                      description: 'must be a date and is required',
                    },
                    time: {
                      bsonType: 'string',
                      description: 'must be a string and is required',
                    },
                    seats: {
                      bsonType: 'array',
                      items: {
                        bsonType: 'object',
                        required: ['seatNumber', 'isAvailable'],
                        properties: {
                          seatNumber: {
                            bsonType: 'string',
                            description: 'must be a string and is required',
                          },
                          isAvailable: {
                            bsonType: 'bool',
                            description: 'must be a boolean and is required',
                          },
                        },
                      },
                    },
                  },
                },
                description: 'must be an array of objects and is required',
              },
            },
          },
        },
        validationLevel: 'strict',
        validationAction: 'error',
      });
      console.log('Movies collection created with schema validation');
    } else {
      console.log('Movies collection already exists');
    }

    // Check if the reservations collection exists
    const reservationCollections = await mongoose.connection.db
      .listCollections({ name: 'reservations' })
      .toArray();
    if (reservationCollections.length === 0) {
      // Create the reservations collection with schema validation
      await mongoose.connection.db.createCollection('reservations', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['user', 'movie', 'functionId', 'seats'],
            properties: {
              user: {
                bsonType: 'objectId',
                description: 'must be an ObjectId and is required',
              },
              movie: {
                bsonType: 'objectId',
                description: 'must be an ObjectId and is required',
              },
              functionId: {
                bsonType: 'objectId',
                description: 'must be an ObjectId and is required',
              },
              seats: {
                bsonType: 'array',
                items: {
                  bsonType: 'string',
                },
                description: 'must be an array of strings and is required',
              },
            },
          },
        },
        validationLevel: 'strict',
        validationAction: 'error',
      });
      console.log('Reservations collection created with schema validation');
    } else {
      console.log('Reservations collection already exists');
    }
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
  _id: { type: String, default: randomUUID() },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: [String], default: ['user'] },
});

const movieSchema = new Schema({
  _id: { type: String, default: randomUUID(), unique: true, required: true },
  title: { type: String, required: true },
  year: { type: Number, required: true },
  director: { type: String, required: true },
  duration: { type: Number, required: true },
  poster: { type: String, required: true },
  genre: { type: [String], required: true },
  rate: { type: Number, required: true },
  functions: { type: [functionSchema], default: [] },
});

const seatSchema = new Schema({
  seatNumber: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
});

const functionSchema = new Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  seats: [seatSchema],
});

const reservationSchema = new Schema({
  user: { type: String, required: true },
  movie: { type: String, required: true },
  functionId: { type: String, required: true },
  seats: [{ type: String, required: true }],
  createdAt: { type: Date, required: true },
});

export const Movie = mongoose.model('Movie', movieSchema);
export const User = mongoose.model('User', userSchema);
export const Reservation = mongoose.model('Reservation', reservationSchema);
