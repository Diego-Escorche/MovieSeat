import { createApp } from './app.js';
import { MovieModel } from './models/movie.js';
import { UserModel } from './models/user.js';
import { ReservationModel } from './models/reservation.js';

createApp({
  movieModel: MovieModel,
  userModel: UserModel,
  reservationModel: ReservationModel,
});
