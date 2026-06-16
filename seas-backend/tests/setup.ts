import 'dotenv/config';
import { jest } from '@jest/globals';

declare const process: any;

const mockFn = (): any => (jest.fn as any)();

jest.mock('puppeteer', () => ({
  launch: mockFn().mockResolvedValue({
    newPage: mockFn().mockResolvedValue({
      setContent: mockFn().mockResolvedValue(undefined),
      pdf: mockFn().mockResolvedValue(Buffer.from('mock-pdf')),
      close: mockFn().mockResolvedValue(undefined),
    }),
    close: mockFn().mockResolvedValue(undefined),
  }),
}));

jest.mock('../src/services/email.service', () => ({
  emailService: {
    initialize: mockFn().mockResolvedValue(undefined),
    sendVerificationEmail: mockFn().mockResolvedValue(undefined),
    sendPasswordResetEmail: mockFn().mockResolvedValue(undefined),
    sendEmail: mockFn().mockResolvedValue(undefined),
  },
}));

jest.mock('../src/services/email-template.service', () => ({
  emailTemplateService: {
    initialize: mockFn().mockResolvedValue(undefined),
    getTemplate: mockFn().mockResolvedValue({}),
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
