// Import the ReservationModel and database connection functions
import { ReservationModel } from '../models/reservation.js';
import { connectDB, disconnectDB } from '../models/mongodb/DBBroker.js';

// Connect to the database before running any tests
beforeAll(async () => {
  await connectDB();
});

// Disconnect from the database after all tests have run
afterAll(async () => {
  await disconnectDB();
});

// Group related tests using describe
describe('ReservationModel', () => {
  // Test case for getting all reservations
  it('should get all reservations', async () => {
    const reservations = await ReservationModel.getAll({});
    expect(reservations).toBeInstanceOf(Array); // Check if the result is an array
    expect(reservations.length).toBeGreaterThan(0); // Check if the array is not empty
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
    const createdReservation = await ReservationModel.create({
      input: newReservation,
    });
    expect(createdReservation).toHaveProperty('user', 'test-user-id'); // Check if the created reservation has the correct user ID
  });

  // Test case for updating a reservation
  it('should update a reservation', async () => {
    const reservationId = 'test-reservation-id';
    const updatedData = { seats: ['B1', 'B2'] };
    const updatedReservation = await ReservationModel.update({
      id: reservationId,
      input: updatedData,
    });
    expect(updatedReservation).toHaveProperty('seats', ['B1', 'B2']); // Check if the reservation has been updated correctly
  });

  // Test case for deleting a reservation
  it('should delete a reservation', async () => {
    const reservationId = 'test-reservation-id';
    const result = await ReservationModel.delete({ id: reservationId });
    expect(result).toBe(true); // Check if the reservation was deleted successfully
  });
});
