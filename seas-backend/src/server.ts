import 'dotenv/config';

import app from './app';
import { validateConnections, getCriticalConnectionFailures } from './config/connection.validator';
import logger from './common/logger';
import { AppDataSource } from './database';

const PORT = process.env.PORT || 3000;

let server: any;

const startServer = async () => {
  try {
    logger.info('Validating critical connections...');
    const results = await validateConnections();
    
    const failures = getCriticalConnectionFailures(results);
    if (failures.length > 0) {
      logger.error('Critical connection failures detected:', failures);
      process.exit(1);
    }
    
    const failedCount = results.filter(r => r.status === 'failed').length;
    if (failedCount > 0) {
      logger.warn(`${failedCount} connection(s) failed but app will continue`);
    }

    server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} signal received: closing HTTP server`);
  
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      
      try {
        if (AppDataSource.isInitialized) {
          await AppDataSource.destroy();
          logger.info('Database connection closed');
        }
        process.exit(0);
      } catch (err) {
        logger.error('Error during database disconnection:', err);
        process.exit(1);
      }
    });

    // If server doesn't close in 10s, force close
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();