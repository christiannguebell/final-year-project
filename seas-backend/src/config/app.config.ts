import 'dotenv/config';

interface AppConfig {
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  upload: {
    dir: string;
    maxFileSize: number;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  cors: {
    origin: string | string[];
  };
}

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const config: AppConfig = {
  port: parseInt(getEnv('PORT', '3000')),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  frontendUrl: getEnv('FRONTEND_URL', 'http://localhost:3001'),
  jwt: {
    secret: getEnv('JWT_SECRET'),
    expiresIn: getEnv('JWT_EXPIRES_IN', '7d'),
    refreshSecret: getEnv('JWT_REFRESH_SECRET'),
    refreshExpiresIn: getEnv('JWT_REFRESH_EXPIRES_IN', '30d'),
  },
  upload: {
    dir: getEnv('UPLOAD_DIR', 'uploads'),
    maxFileSize: parseInt(getEnv('MAX_FILE_SIZE', '5242880')),
  },
  rateLimit: {
    windowMs: parseInt(getEnv('RATE_LIMIT_WINDOW_MS', '900000')),
    maxRequests: parseInt(getEnv('RATE_LIMIT_MAX_REQUESTS', '100')),
  },
  cors: {
    origin: getEnv('CORS_ORIGIN', 'http://localhost:3001, http://localhost:3000, http://localhost:5173').split(',').map(o => o.trim()),
  },
};

export default config;