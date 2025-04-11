import { createApp } from './app.js';
import { MovieService } from './services/movie.js';
import { UserService } from './services/user.js';
import { ReservationService } from './services/reservation.js';

// Instantiate service classes
const movieService = new MovieService();
const userService = new UserService();
const reservationService = new ReservationService();

// Pass the instances into the app factory
createApp({
  movieService,
  userService,
  reservationService,
});
