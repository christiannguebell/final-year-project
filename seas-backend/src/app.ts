import 'dotenv/config';

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from './middlewares';
import { validateConnections } from './config/connection.validator';
import { logger } from './common/logger';
import routes from './routes';
import config from './config';

import { apiReference } from '@scalar/express-api-reference';
import { swaggerSpec } from './config/swagger';
import { generalLimiter } from './middlewares/security.middleware';
import { sanitizeInput } from './middlewares/sanitization.middleware';

const app: Application = express();

if (config.nodeEnv === 'production') {
  app.set('trust proxy', 1);
}


app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"],
    },
  },
}));

app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(generalLimiter);
app.use(sanitizeInput);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags:
 *       - System
 *     summary: System health check
 *     description: Checks the status of database and other critical services.
 *     responses:
 *       200:
 *         description: All services operational
 *       503:
 *         description: Some services unavailable
 */
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
    logger.error('Health check error:', error);

    res.status(503).json({

      success: false,
      message: 'Health check failed',
      data: null,
    });
  }
});

// API Documentation
app.use(
  '/api/docs',
  apiReference({
    theme: 'purple',
    layout: 'modern',
    spec: {
      content: swaggerSpec,
    },
  })
);

// Register all routes
app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;