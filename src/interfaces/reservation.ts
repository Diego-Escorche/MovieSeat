export interface IReservation {
  _id: string;
  user: string;
  movie: string;
  functionId: string;
  seats: string[];
  createdAt?: Date;
}
