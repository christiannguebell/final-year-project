import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Program } from './entities/Program';
import { Application } from './entities/Application';
import { AcademicRecord } from './entities/AcademicRecord';
import { Document } from './entities/Document';
import { Payment } from './entities/Payment';
import { ExamSession } from './entities/ExamSession';
import { ExamCenter } from './entities/ExamCenter';
import { ExamAssignment } from './entities/ExamAssignment';
import { Result } from './entities/Result';
import { ResultScore } from './entities/ResultScore';
import { Notification } from './entities/Notification';
import { CandidateProfile } from './entities/CandidateProfile';

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: getEnv('DB_HOST', 'localhost'),
  port: parseInt(getEnv('DB_PORT', '5432')),
  username: getEnv('DB_USER', 'postgres'),
  password: getEnv('DB_PASSWORD'),
  database: getEnv('DB_NAME', 'seas_db'),
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [
    User,
    CandidateProfile,
    Program,
    Application,
    AcademicRecord,
    Document,
    Payment,
    ExamSession,
    ExamCenter,
    ExamAssignment,
    Result,
    ResultScore,
    Notification,
  ],
  migrations: [],
  subscribers: [],
});



export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export * from './entities/User';
export * from './entities/CandidateProfile';
export * from './entities/Program';
export * from './entities/Application';
export * from './entities/AcademicRecord';
export * from './entities/Document';
export * from './entities/Payment';
export * from './entities/ExamSession';
export * from './entities/ExamCenter';
export * from './entities/ExamAssignment';
export * from './entities/Result';
export * from './entities/ResultScore';
export * from './entities/Notification';