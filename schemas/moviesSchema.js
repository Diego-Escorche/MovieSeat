import { z } from 'zod'; // To validate the JSON data

// Validate the data with a schema.
const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string.',
    required_error: 'Movie tittle is required.',
  }),
  year: z.number().int(),
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

export function validateMovie(object) {
  return movieSchema.safeParse(object);
}

export function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object); // The partial() makes the properties optional when it validates them.
}
