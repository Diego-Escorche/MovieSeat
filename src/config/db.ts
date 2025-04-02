import mongoose, { ConnectOptions } from 'mongoose';
import { ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// Allow debug
mongoose.set('debug', true);

//---------------------------------------

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '', {
      dbName: 'MovieSeat',
      serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
      },
    } as ConnectOptions);
    console.log(`Connected to the database ${mongoose.connection.name}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); // Exit the process if the connection fails
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('Disconnected successfully from the database');
  } catch (error) {
    console.error('Error disconnecting from the database', error);
  }
}
