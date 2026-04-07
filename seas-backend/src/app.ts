import 'dotenv/config';

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initializeDatabase } from './database';
import { errorHandler, notFoundHandler } from './middlewares';
import { validateConnections } from './config/connection.validator';
import { authRoutes } from './modules/auth';
import { usersRoutes } from './modules/users';

const app: Application = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const connections = await validateConnections();
    const allConnected = connections.every((c) => c.status === 'connected');
    
    res.status(allConnected ? 200 : 503).json({
      success: allConnected,
      message: allConnected ? 'All services operational' : 'Some services unavailable',
      data: { connections },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Health check failed',
      data: null,
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;