import 'dotenv/config';

import app from './app';
import { validateConnections, getCriticalConnectionFailures } from './config/connection.validator';
import logger from './common/logger';

const PORT = process.env.PORT || 3000;

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

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();