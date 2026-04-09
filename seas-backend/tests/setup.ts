import 'dotenv/config';
import { jest } from '@jest/globals';

// Declare global process for IDE if needed, but it should be covered by @types/node
declare const process: any;

// Mocking the email services
jest.mock('../src/services/email.service', () => ({
  emailService: {
    initialize: (jest.fn() as any).mockResolvedValue(undefined),
    sendVerificationEmail: (jest.fn() as any).mockResolvedValue(undefined),
    sendPasswordResetEmail: (jest.fn() as any).mockResolvedValue(undefined),
    sendEmail: (jest.fn() as any).mockResolvedValue(undefined),
  },
}));

jest.mock('../src/services/email-template.service', () => ({
  emailTemplateService: {
    initialize: (jest.fn() as any).mockResolvedValue(undefined),
    getTemplate: (jest.fn() as any).mockResolvedValue({}),
  },
}));

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.DB_PASSWORD = 'test-password';
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'postgres';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
