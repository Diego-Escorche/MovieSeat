import { createApp } from './app.js';
import { MovieModel } from './services/movie.js';
import { UserModel } from './services/user.js';
import { ReservationModel } from './services/reservation.js';

createApp({
  movieModel: MovieModel,
  userModel: UserModel,
  reservationModel: ReservationModel,
});
