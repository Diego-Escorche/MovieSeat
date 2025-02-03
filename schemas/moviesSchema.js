const z = require('zod'); // To validate the JSON data

// Validate the data with a schema.
const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string.',
    required_error: 'Movie tittle is required.',
  }),
  year: z.number().int().min(1900),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().int().min(0).max(10),
  poster: z.string().url({
    message: 'Poster must be a valid URL',
  }),
  genre: z.array(
    z.enum(
      [
        'Action',
        'Adventure',
        'Comedy',
        'Drama',
        'Fantasy',
        'Horror',
        'Thriller',
        'Sci-Fi',
      ],
      {
        required_error: 'Movie genre is required',
        invalid_type_error: 'Movie genre must be an array of enum Genre.',
      },
    ),
  ),
});

function validateMovie(object) {
  return movieSchema.safeParse(object);
}

module.exports = {
  validateMovie,
};
