import express, { Express, Request, Response, NextFunction } from 'express';
import { ApiError, handleErrors } from './lib/errors';
import apiRoutes from './api/routes';
import config from './config';

const app: Express = express();
const port = config.port;

app.use(express.json());

app.use('/api', apiRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
