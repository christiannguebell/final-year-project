import 'dotenv/config';

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initializeDatabase } from './database';
import { errorHandler, notFoundHandler } from './middlewares';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await initializeDatabase();
    res.json({ success: true, message: 'Server is running', data: null });
  } catch (error) {
    res.status(503).json({ success: false, message: 'Database unavailable', data: null });
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;