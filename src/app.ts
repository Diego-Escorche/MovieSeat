import express, {
  json,
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import { createMovieRouter } from './routes/movies.js';
import { createUserRouter } from './routes/user.js';
import { createReservationRouter } from './routes/reservation.js';
import { corsMiddleware } from './middlewares/cors.js';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';
import { MovieService } from './services/movie.js';
import { UserService } from './services/user.js';
import { ReservationService } from './services/reservation.js';

dotenv.config();

interface AppDependencies {
  movieService: MovieService;
  userService: UserService;
  reservationService: ReservationService;
}

export const createApp = async ({
  movieService,
  userService,
  reservationService,
}: AppDependencies): Promise<Express> => {
  await connectDB();

  const app = express();
  app.use(json());
  app.use(corsMiddleware({ acceptedOrigins: ['*'] }));
  app.use(cookieParser());
  app.disable('x-powered-by');

  // Create first admin if needed
  const createInitialAdmin = async (): Promise<void> => {
    const email = process.env.ADMIN_EMAIL;
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !username || !password) {
      console.error('Admin credentials are not set in environment variables');
      return;
    }

    let user = await userService.login({ email, username });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await userService.register({
        input: {
          email,
          username,
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
      await userService.update({ id: user._id, input: user });
      console.log('User promoted to admin successfully');
    }
  };

  // Execute admin creation if flag is set
  if (process.env.CREATE_INITIAL_ADMIN === 'true') {
    createInitialAdmin().catch((error) => {
      console.error('Error creating initial admin user:', error);
    });

    process.env.CREATE_INITIAL_ADMIN = 'false';

    fs.writeFileSync(
      './.env',
      fs
        .readFileSync('./.env', 'utf8')
        .replace('CREATE_INITIAL_ADMIN=true', 'CREATE_INITIAL_ADMIN=false'),
    );
  }

  // Routes
  app.use('/movies', createMovieRouter({ movieService, userService }));
  app.use('/auth', createUserRouter({ userService }));
  app.use(
    '/reservations',
    createReservationRouter({ reservationService, userService, movieService }),
  );

  // Global error handler
  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  // Start server
  const PORT = process.env.PORT ?? '1234';
  const server = app.listen(Number(PORT), () => {
    console.log(`listening on port: http://localhost:${PORT}`);
  });

  // Graceful shutdown
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
