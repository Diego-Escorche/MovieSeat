import express, { json } from 'express';
import { createMovieRouter } from './routes/movies.js';
import { createUserRouter } from './routes/user.js';
import { createReservationRouter } from './routes/reservation.js';
import { corsMiddleware } from './middlewares/cors.js';
import bcrypt from 'bcrypt';
import { connectDB, disconnectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export const createApp = async ({
  movieModel,
  userModel,
  reservationModel,
}) => {
  await connectDB();
  const app = express();

  app.use(json());
  app.use(corsMiddleware({ acceptedOrigins: '*' }));
  app.use(cookieParser());

  app.disable('x-powered-by');

  // Function to create the first admin.
  const createInitialAdmin = async () => {
    const email = process.env.ADMIN_EMAIL;
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !username || !password) {
      console.error('Admin credentials are not set in environment variables');
      return;
    }

    let user = await userModel.login({
      email: email,
      username: username,
      password: password,
    });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await userModel.register({
        input: {
          email: email,
          username: username,
          password: hashedPassword,
          role: ['admin'],
        },
      });
      console.log('Admin user created successfully');
    } else if (
      !user.role.includes('admin') &&
      user.username === username &&
      (await bcrypt.compare(password, user.password))
    ) {
      user.role.push('admin');
      await userModel.update({ id: user._id, input: user });
      console.log('User promoted to admin successfully');
    }
  };

  // Call the function to create the initial admin if the flag is set as true.
  if (process.env.CREATE_INITIAL_ADMIN === 'true') {
    createInitialAdmin().catch((error) => {
      console.error('Error creating initial admin user:', error);
    });

    // Update the environment variable to false. First locally and then in the .env file
    process.env.CREATE_INITIAL_ADMIN = 'false';
    fs.writeFileSync(
      './.env',
      fs
        .readFileSync('./.env', 'utf8')
        .replace('CREATE_INITIAL_ADMIN=true', 'CREATE_INITIAL_ADMIN=false'),
    );
  }

  app.use('/movies', createMovieRouter({ movieModel, userModel }));
  app.use('/auth', createUserRouter({ userModel }));
  app.use(
    '/reservations',
    createReservationRouter({ reservationModel, userModel, movieModel }),
  );
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  const PORT = process.env.PORT ?? 1234;

  const server = app.listen(PORT, () => {
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
  return app;
};
