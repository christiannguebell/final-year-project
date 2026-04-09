import 'dotenv/config';

jest.mock('../src/common/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

jest.mock('../src/services/email.service', () => ({
  emailService: {
    initialize: jest.fn().mockResolvedValue(undefined),
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
    sendEmail: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../src/services/email-template.service', () => ({
  emailTemplateService: {
    initialize: jest.fn().mockResolvedValue(undefined),
    getTemplate: jest.fn().mockResolvedValue({}),
  },
}));

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_REFRESH_EXPIRES_IN = '30d';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'seas_db';
process.env.DB_USER = 'ngangman_teddy';
process.env.DB_PASSWORD = 'Teddy2005@';
process.env.FRONTEND_URL = 'http://localhost:3001';
process.env.SKIP_EMAIL = 'true';

beforeAll(async () => {
  const { AppDataSource } = await import('../src/database');
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const { seedAdminUser } = await import('../src/database/seeds/admin.seed');
  await seedAdminUser();
  const { seedTestProgram } = await import('../src/database/seeds/program.seed');
  await seedTestProgram();
});
