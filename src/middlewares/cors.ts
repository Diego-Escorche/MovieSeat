import cors, { CorsOptionsDelegate } from 'cors';

const ACCEPTED_ORIGINS: string[] = [
  'http://localhost:8080',
  'http://localhost:1234',
  'https://movies.com',
];

interface CorsMiddlewareOptions {
  acceptedOrigins?: string[];
}

export const corsMiddleware = ({
  acceptedOrigins = ACCEPTED_ORIGINS,
}: CorsMiddlewareOptions = {}) => {
  return cors({
    origin: (origin, callback) => {
      if (!origin || acceptedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
  });
};
