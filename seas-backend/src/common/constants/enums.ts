import { UserRole, UserStatus } from '../../database/entities/User';
import { ApplicationStatus } from '../../database/entities/Application';
import { PaymentStatus } from '../../database/entities/Payment';
import { DocumentType, DocumentStatus } from '../../database/entities/Document';
import { ExamSessionStatus } from '../../database/entities/ExamSession';
import { ResultStatus } from '../../database/entities/Result';
import { NotificationType, NotificationStatus } from '../../database/entities/Notification';

export {
  UserRole,
  UserStatus,
  ApplicationStatus,
  PaymentStatus,
  DocumentType,
  DocumentStatus,
  ExamSessionStatus,
  ResultStatus,
  NotificationType,
  NotificationStatus,
};

export enum ExamAssignmentStatus {
  ASSIGNED = 'assigned',
  CONFIRMED = 'confirmed',
  ABSENT = 'absent',
}

export enum ProgramStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export const STATUS_ENUM = {
  USER: UserStatus,
  APPLICATION: ApplicationStatus,
  PAYMENT: PaymentStatus,
  DOCUMENT: DocumentStatus,
  EXAM_SESSION: ExamSessionStatus,
  EXAM_ASSIGNMENT: ExamAssignmentStatus,
  RESULT: ResultStatus,
  NOTIFICATION: NotificationStatus,
  PROGRAM: ProgramStatus,
} as const;

export const ROLE_ENUM = {
  USER: UserRole,
} as const;

export const TYPE_ENUM = {
  DOCUMENT: DocumentType,
  NOTIFICATION: NotificationType,
} as const;

export const httpStatusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const errorMessages = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  DUPLICATE_RESOURCE: 'Resource already exists',
} as const;