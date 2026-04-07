import { AppDataSource } from '../database';
import { emailService } from '../services/email.service';
import logger from '../common/logger';

export interface ConnectionCheck {
  name: string;
  status: 'connected' | 'failed' | 'skipped';
  error?: string;
}

export const validateConnections = async (): Promise<ConnectionCheck[]> => {
  const results: ConnectionCheck[] = [];

  // Check database connection
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.query('SELECT 1');
    results.push({ name: 'database', status: 'connected' });
    logger.info('Database connection verified');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    results.push({ name: 'database', status: 'failed', error: message });
    logger.error('Database connection failed:', error);
  }

  // Check email/SMTP connection
  try {
    if (process.env.SKIP_EMAIL !== 'true') {
      await emailService.initialize();
      results.push({ name: 'email', status: 'connected' });
      logger.info('Email service connection verified');
    } else {
      results.push({ name: 'email', status: 'skipped' });
      logger.info('Email service skipped (SKIP_EMAIL=true)');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    results.push({ name: 'email', status: 'failed', error: message });
    logger.error('Email service connection failed:', error);
  }

  return results;
};

export const getCriticalConnectionFailures = (results: ConnectionCheck[]): string[] => {
  return results
    .filter((r) => r.status === 'failed')
    .map((r) => `${r.name}: ${r.error}`);
};

export default { validateConnections, getCriticalConnectionFailures };