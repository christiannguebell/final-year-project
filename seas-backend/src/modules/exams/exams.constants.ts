import { ExamSessionStatus } from '../../database/entities/ExamSession';

export const EXAM_MESSAGES = {
  SESSION_NOT_FOUND: 'Exam session not found',
  CENTER_NOT_FOUND: 'Exam center not found',
  ASSIGNMENT_NOT_FOUND: 'Exam assignment not found',
  NO_ASSIGNMENT: 'No exam assignment found for this user',
  SESSION_CREATED: 'Exam session created successfully',
  SESSION_UPDATED: 'Exam session updated successfully',
  CENTER_CREATED: 'Exam center created successfully',
  CENTER_UPDATED: 'Exam center updated successfully',
  ASSIGNED: 'Candidates assigned to exam successfully',
} as const;

export { ExamSessionStatus };

export default { EXAM_MESSAGES };