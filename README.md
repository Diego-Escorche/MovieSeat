# Movie-Reserve

Movie-Reserve is a web application for managing a collection of movies. It provides an API for performing CRUD operations on movies stored in a MongoDB database.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Diego-Escorche/Movie-Reserve.git
   cd Movie-Reserve
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```
   MONGODB_URI=<your_mongodb_uri>
   PORT=<your_port>
   JWT_SECRET=<your_jwt_secret>
   ADMIN_EMAIL=<admin_email>
   ADMIN_USERNAME=<admin_username>
   ADMIN_PASSWORD=<admin_password>
   CREATE_INITIAL_ADMIN=true
   ```

4. Start the application:
   ```sh
   npm start
   ```

## Usage

Once the application is running, you can use the following API endpoints to interact with the movie collection.

## API Endpoints

### Get All Movies

- **URL:** `/movies`
- **Method:** `GET`
- **Query Parameters:**
  - `genre` (optional): Filter movies by genre
- **Response:**
  ```json
  [
    {
      "id": "1",
      "title": "Movie title",
      "year": 2024,
      "director": "Directors name",
      "duration": 160,
      "poster": "Poster link",
      "genre": ["Action", "Comedy", "Adventure", "Drama"],
      "rate": 10
    }
    // ...more movies
  ]
  ```

### Get Movie by ID

- **URL:** `/movies/:id`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "id": "1",
    "title": "Movie title",
    "year": 2024,
    "director": "Directors name",
    "duration": 160,
    "poster": "Poster link",
    "genre": ["Action", "Comedy", "Adventure", "Drama"],
    "rate": 10
  }
  ```

### Create a New Movie

- **URL:** `/movies`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "title": "Movie title",
    "year": 2024,
    "director": "Directors name",
    "duration": 123,
    "poster": "Poster link",
    "genre": ["Genres"],
    "rate": 7
  }
  ```
- **Response:**
  ```json
  {
    "id": "2",
    "title": "Movie title",
    "year": 2024,
    "director": "Directors name",
    "duration": 123,
    "poster": "Poster link",
    "genre": ["Genres"],
    "rate": 7
  }
  ```

### Update a Movie

- **URL:** `/movies/:id`
- **Method:** `PATCH`
- **Request Body:**
  ```json
  {
    "year": 2022
  }
  ```
- **Response:**
  ```json
  {
    "id": "1",
    "title": "Movie title",
    "year": 2022,
    "director": "Directors name",
    "duration": 160,
    "poster": "Poster link",
    "genre": ["Action", "Comedy", "Adventure", "Drama"],
    "rate": 10
  }
  ```

### Delete a Movie

- **URL:** `/movies/:id`
- **Method:** `DELETE`
- **Response:**
  ```json
  {
    "message": "Movie deleted successfully"
  }
  ```

## Testing

This project uses Jest for testing. The test files are located in the `__tests__` directory.

### Running Tests

To run the tests, use the following command:

```sh
npm test
```

### Test Files

- `__tests__/movieModel.test.js`: Tests for the `MovieModel`.
- `__tests__/reservationModel.test.js`: Tests for the `ReservationModel`.
- `__tests__/userModel.test.js`: Tests for the `UserModel`.
- `__tests__/movieController.test.js`: Tests for the `MovieController`.
- `__tests__/reservationController.test.js`: Tests for the `ReservationController`.
- `__tests__/userController.test.js`: Tests for the `UserController`.

### Example Test File

Here is an example of a test file for the `MovieModel`:

```js
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
```

By following these instructions, you can set up and run tests for the Movie-Reserve application. If you have any further questions or need additional assistance, feel free to ask!
