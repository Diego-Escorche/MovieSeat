import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export const readJSON = (path) => require(path);

export const generateSeats = () => {
  // Every function will have rows of seats from A to F and 24 seats per row
  const rows = 'ABCDEF';
  const seats = [];

  for (let row of rows) {
    for (let number = 1; number <= 24; number++) {
      seats.push({ seatNumber: `${row}${number}`, isAvailable: true });
    }
  }

  return seats;
};
