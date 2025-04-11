import { createRequire } from 'node:module';
import { Request, Response, NextFunction } from 'express';
import { Seat } from './interfaces/movie.js'; // Adjust the path if needed

const require = createRequire(import.meta.url);

// Read JSON files with proper typing
export const readJSON = <T = unknown>(path: string): T => {
  return require(path);
};

// Generate a default seat map (A–F rows, 24 seats per row)
export const generateSeats = (): Seat[] => {
  const rows = 'ABCDEF';
  const seats: Seat[] = [];

  for (const row of rows) {
    for (let number = 1; number <= 24; number++) {
      seats.push({ seatNumber: `${row}${number}`, isAvailable: true });
    }
  }

  return seats;
};

/**
 * Wraps an async Express route or middleware handler to catch errors.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
