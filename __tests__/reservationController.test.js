// Import necessary modules and functions
import request from 'supertest';
import { createApp } from '../app.js';
import { ReservationModel } from '../models/reservation.js';
import { connectDB, disconnectDB } from '../models/mongodb/DBBroker.js';

let app;

// Connect to the database and create the app before running any tests
beforeAll(async () => {
  await connectDB();
  app = await createApp({ reservationModel: ReservationModel });
});

// Disconnect from the database after all tests have run
afterAll(async () => {
  await disconnectDB();
});

// Group related tests using describe
describe('ReservationController', () => {
  // Test case for getting all reservations
  it('should get all reservations', async () => {
    const response = await request(app).get('/reservations');
    expect(response.status).toBe(200); // Check if the response status is 200 (OK)
    expect(response.body).toBeInstanceOf(Array); // Check if the response body is an array
  });

  // Test case for creating a new reservation
  it('should create a new reservation', async () => {
    const newReservation = {
      user: 'test-user-id',
      movie: 'test-movie-id',
      functionId: 'test-function-id',
      seats: ['A1', 'A2'],
      createdAt: new Date(),
    };
    const response = await request(app)
      .post('/reservations')
      .send(newReservation);
    expect(response.status).toBe(201); // Check if the response status is 201 (Created)
    expect(response.body).toHaveProperty('user', 'test-user-id'); // Check if the created reservation has the correct user ID
  });

  // Test case for updating a reservation
  it('should update a reservation', async () => {
    const reservationId = 'test-reservation-id';
    const updatedData = { seats: ['B1', 'B2'] };
    const response = await request(app)
      .patch(`/reservations/${reservationId}`)
      .send(updatedData);
    expect(response.status).toBe(200); // Check if the response status is 200 (OK)
    expect(response.body).toHaveProperty('seats', ['B1', 'B2']); // Check if the reservation has been updated correctly
  });

  // Test case for deleting a reservation
  it('should delete a reservation', async () => {
    const reservationId = 'test-reservation-id';
    const response = await request(app).delete(
      `/reservations/${reservationId}`,
    );
    expect(response.status).toBe(200); // Check if the response status is 200 (OK)
    expect(response.body).toHaveProperty(
      'message',
      'Reservation deleted successfully',
    ); // Check if the reservation was deleted successfully
  });
});
