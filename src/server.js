import { createApp } from './app.js';
import { MovieService } from './services/movie.js';
import { UserService } from './services/user.js';
import { ReservationService } from './services/reservation.js';

createApp({
  movieModel: MovieService,
  userModel: UserService,
  reservationModel: ReservationService,
});
