import express, { json } from 'express';
import { moviesRouter } from './routes/movies';
import { corsMiddleware } from './middlewares/cors';

const app = express();
app.use(json());
app.use(corsMiddleware());
app.disable('x-powered-by');

app.use('/movies', moviesRouter);

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`listening on port: http://localhost:${PORT}`);
});
