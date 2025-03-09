// Import the MovieModel and database connection functions
import { MovieModel } from '../models/movie.js';
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
describe('MovieModel', () => {
  // Test case for getting all movies
  it('should get all movies', async () => {
    const movies = await MovieModel.getAll({});
    expect(movies).toBeInstanceOf(Array); // Check if the result is an array
    expect(movies.length).toBeGreaterThan(0); // Check if the array is not empty
  });

  // Test case for getting a movie by ID
  it('should get a movie by ID', async () => {
    const movieId = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3';
    const movie = await MovieModel.getById({ id: movieId });
    expect(movie).toHaveProperty('title', 'The Shawshank Redemption'); // Check if the movie has the correct title
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
    const createdMovie = await MovieModel.create({ input: newMovie });
    expect(createdMovie).toHaveProperty('title', 'Test Movie'); // Check if the created movie has the correct title
  });

  // Test case for updating a movie
  it('should update a movie', async () => {
    const movieId = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3';
    const updatedData = { year: 2026 };
    const updatedMovie = await MovieModel.update({
      id: movieId,
      input: updatedData,
    });
    expect(updatedMovie).toHaveProperty('year', 2026); // Check if the movie has been updated correctly
  });

  // Test case for deleting a movie
  it('should delete a movie', async () => {
    const movieId = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3';
    const result = await MovieModel.delete({ id: movieId });
    expect(result).toBe(true); // Check if the movie was deleted successfully
  });
});
