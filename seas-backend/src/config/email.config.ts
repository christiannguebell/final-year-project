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

const skipEmail = process.env.SKIP_EMAIL === 'true';

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key];
  // When SKIP_EMAIL=false (real email sending), all SMTP vars are required
  if (!value && !skipEmail && !fallback) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Set SKIP_EMAIL=true to bypass email sending in development.`
    );
  }
  return value || fallback || '';
};

export const emailConfig: EmailConfig = {
  host: getEnv('SMTP_HOST', 'localhost'),
  port: parseInt(getEnv('SMTP_PORT', '1025')),
  // Brevo uses port 587 with STARTTLS (secure=false), NOT port 465 (SSL)
  secure: getEnv('SMTP_SECURE', 'false') === 'true',
  auth: {
    user: getEnv('SMTP_USER', ''),
    // SMTP_PASSWORD is the Brevo SMTP key (generated in Brevo dashboard)
    pass: getEnv('SMTP_PASSWORD', ''),
  },
  from: getEnv('EMAIL_FROM', 'noreply@seas-exam.local'),
};

export default emailConfig;