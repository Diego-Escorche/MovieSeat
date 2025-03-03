import express, { json } from 'express';
import { createMovieRouter } from './routes/movies.js';
import { corsMiddleware } from './middlewares/cors.js';
import 'dotenv/config';
import { connectDB, disconnectDB } from './models/mongodb/DBBroker.js';
import { createUserRouter } from './routes/user.js';
import { cookieparser } from 'cookie-parser';

export const createApp = async ({ movieModel, userModel }) => {
  await connectDB();

  const app = express();
  app.use(json());
  app.use(corsMiddleware({ acceptedOrigins: '*' }));
  app.use(cookieparser());
  app.disable('x-powered-by');

  app.use('/movies', createMovieRouter({ movieModel }));
  app.use('/auth', createUserRouter({ userModel }));

  const PORT = process.env.PORT ?? 1234;

  const server = await app.listen(PORT, () => {
    console.log(`listening on port: http://localhost:${PORT}`);
  });

  // Manage the end or interruption of the process to disconnect the database
  const gracefulShutdown = async () => {
    console.log('Shutting down gracefully...');
    await disconnectDB();
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
};
