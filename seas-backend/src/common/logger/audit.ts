import winston from 'winston';
import path from 'path';
import fs from 'fs';

const auditDir = path.join(process.cwd(), 'logs', 'audit');

if (!fs.existsSync(auditDir)) {
  fs.mkdirSync(auditDir, { recursive: true });
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  PUBLISH = 'PUBLISH',
  ASSIGN = 'ASSIGN',
  VERIFY = 'VERIFY',
}

export interface AuditLogEntry {
  timestamp: string;
  action: AuditAction;
  userId: string;
  userRole: string;
  targetType?: string;
  targetId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

const auditFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => {
    const entry: AuditLogEntry = {
      timestamp: info.timestamp as string,
      action: info.action as AuditAction,
      userId: info.userId as string,
      userRole: info.userRole as string,
      targetType: info.targetType as string | undefined,
      targetId: info.targetId as string | undefined,
      ipAddress: info.ipAddress as string | undefined,
      userAgent: info.userAgent as string | undefined,
      details: info.details as Record<string, unknown> | undefined,
    };
    return JSON.stringify(entry);
  })
);

export const auditLogger = winston.createLogger({
  level: 'info',
  format: auditFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(auditDir, 'audit.log'),
    }),
  ],
});

export const logAudit = (
  action: AuditAction,
  userId: string,
  userRole: string,
  options?: {
    targetType?: string;
    targetId?: string;
    ipAddress?: string;
    userAgent?: string;
    details?: Record<string, unknown>;
  }
) => {
  auditLogger.info('', {
    action,
    userId,
    userRole,
    ...options,
  });
};

export default auditLogger;