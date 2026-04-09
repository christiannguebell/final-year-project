import 'dotenv/config';

// Mocking the email services
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
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.DB_NAME = 'seas_test'; // Use the dedicated test database

beforeAll(async () => {
  const { AppDataSource } = await import('../src/database');
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  
  await AppDataSource.synchronize(true); // Create tables

  
  // Clear the database before tests
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE;`);
  }

  // Seed data
  const { seedAdminUser } = await import('../src/database/seeds/admin.seed');
  await seedAdminUser();
  const { seedTestProgram } = await import('../src/database/seeds/program.seed');
  await seedTestProgram();
});

afterAll(async () => {
  const { AppDataSource } = await import('../src/database');
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});
