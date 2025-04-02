import { z } from 'zod';

// ------------------------
// 🎬 Movie Schema (Zod)
// ------------------------

export const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string.',
    required_error: 'Movie title is required.',
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
  functions: z
    .array(
      z.object({
        datetime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, {
          message: 'Datetime must be in ISO 8601 format',
        }),
      }),
    )
    .optional(),
});

// ------------------------
// 🔍 Types
// ------------------------

export type MovieInput = z.infer<typeof movieSchema>;

// ------------------------
// ✅ Validators
// ------------------------

export function validateMovie(object: unknown) {
  const { _id, ...data } = object as Record<string, unknown>;
  return movieSchema.safeParse(data);
}

export function validatePartialMovie(object: unknown) {
  const { _id, ...data } = object as Record<string, unknown>;
  return movieSchema.partial().safeParse(data);
}
