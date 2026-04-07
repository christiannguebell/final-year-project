import 'dotenv/config';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (!value && key !== 'SMTP_PASSWORD') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || fallback || '';
};

export const emailConfig: EmailConfig = {
  host: getEnv('SMTP_HOST', 'localhost'),
  port: parseInt(getEnv('SMTP_PORT', '1025')),
  secure: getEnv('SMTP_SECURE', 'false') === 'true',
  auth: {
    user: getEnv('SMTP_USER', ''),
    pass: process.env.SMTP_PASSWORD || '',
  },
  from: getEnv('EMAIL_FROM', 'noreply@seas-exam.local'),
};

export default emailConfig;