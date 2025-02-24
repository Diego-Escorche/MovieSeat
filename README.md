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
      "title": "Movie Title",
      "genre": "Genre",
      "releaseDate": "2023-01-01"
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
    "title": "Movie Title",
    "genre": "Genre",
    "releaseDate": "2023-01-01"
  }
  ```

### Create a New Movie

- **URL:** `/movies`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "title": "New Movie",
    "genre": "Genre",
    "releaseDate": "2023-01-01"
  }
  ```
- **Response:**
  ```json
  {
    "id": "2",
    "title": "New Movie",
    "genre": "Genre",
    "releaseDate": "2023-01-01"
  }
  ```

### Update a Movie

- **URL:** `/movies/:id`
- **Method:** `PUT`
- **Request Body:**
  ```json
  {
    "title": "Updated Movie",
    "genre": "Updated Genre",
    "releaseDate": "2023-01-01"
  }
  ```
- **Response:**
  ```json
  {
    "id": "1",
    "title": "Updated Movie",
    "genre": "Updated Genre",
    "releaseDate": "2023-01-01"
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
