// Import necessary modules and functions
import request from 'supertest';
import { createApp } from '../app.js';
import { MovieModel } from '../models/movie.js';
import { connectDB, disconnectDB } from '../models/mongodb/DBBroker.js';

let app;

// Connect to the database and create the app before running any tests
beforeAll(async () => {
  await connectDB();
  app = await createApp({ movieModel: MovieModel });
});

// Disconnect from the database after all tests have run
afterAll(async () => {
  await disconnectDB();
});

// Group related tests using describe
describe('MovieController', () => {
  // Test case for getting all movies
  it('should get all movies', async () => {
    const response = await request(app).get('/movies');
    expect(response.status).toBe(200); // Check if the response status is 200 (OK)
    expect(response.body).toBeInstanceOf(Array); // Check if the response body is an array
  });

  // Test case for getting a movie by ID
  it('should get a movie by ID', async () => {
    const movieId = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3';
    const response = await request(app).get(`/movies/${movieId}`);
    expect(response.status).toBe(200); // Check if the response status is 200 (OK)
    expect(response.body).toHaveProperty('title', 'The Shawshank Redemption'); // Check if the movie has the correct title
  });

  // Test case for creating a new movie
  it('should create a new movie', async () => {
    const newMovie = {
      title: 'Test Movie',
      year: 2025,
      director: 'Test Director',
      duration: 120,
      poster: 'https://example.com/poster.jpg',
      genre: ['Action'],
      rate: 8,
    };
    const response = await request(app).post('/movies').send(newMovie);
    expect(response.status).toBe(201); // Check if the response status is 201 (Created)
    expect(response.body).toHaveProperty('title', 'Test Movie'); // Check if the created movie has the correct title
  });

  // Test case for updating a movie
  it('should update a movie', async () => {
    const movieId = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3';
    const updatedData = { year: 2026 };
    const response = await request(app)
      .patch(`/movies/${movieId}`)
      .send(updatedData);
    expect(response.status).toBe(200); // Check if the response status is 200 (OK)
    expect(response.body).toHaveProperty('year', 2026); // Check if the movie has been updated correctly
  });

  // Test case for deleting a movie
  it('should delete a movie', async () => {
    const movieId = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3';
    const response = await request(app).delete(`/movies/${movieId}`);
    expect(response.status).toBe(200); // Check if the response status is 200 (OK)
    expect(response.body).toHaveProperty(
      'message',
      'Movie deleted successfully',
    ); // Check if the movie was deleted successfully
  });
});
