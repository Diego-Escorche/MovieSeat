import { createApp } from './app.js';
import { MovieModel } from './src/models/movie.js';
import { UserModel } from './src/models/user.js';
import { ReservationModel } from './src/models/reservation.js';

createApp({
  movieModel: MovieModel,
  userModel: UserModel,
  reservationModel: ReservationModel,
});
