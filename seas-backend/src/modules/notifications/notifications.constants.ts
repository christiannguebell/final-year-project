export { NotificationType, NotificationStatus, NotificationChannel } from '../../database/entities/Notification';

export const NOTIFICATION_MESSAGES = {
  NOT_FOUND: 'Notification not found',
  CREATED: 'Notification created successfully',
  MARKED_READ: 'Notification marked as read',
  ALL_MARKED_READ: 'All notifications marked as read',
  DELETED: 'Notification deleted',
  EMAIL_SENT: 'Email notification sent',
  EMAIL_FAILED: 'Failed to send email notification',
} as const;

export const EMAIL_TEMPLATES = {
  PASSWORD_RESET: 'password-reset',
  EMAIL_VERIFICATION: 'email-verification',
  APPLICATION_APPROVED: 'application-approved',
  APPLICATION_REJECTED: 'application-rejected',
  PAYMENT_CONFIRMED: 'payment-confirmed',
  EXAM_SCHEDULED: 'exam-scheduled',
  EXAM_ASSIGNMENT: 'exam-assignment',
  RESULT_PUBLISHED: 'result-published',
} as const;

export const EMAIL_SUBJECTS = {
  [EMAIL_TEMPLATES.PASSWORD_RESET]: 'Reset Your Password',
  [EMAIL_TEMPLATES.EMAIL_VERIFICATION]: 'Verify Your Email',
  [EMAIL_TEMPLATES.APPLICATION_APPROVED]: 'Application Approved',
  [EMAIL_TEMPLATES.APPLICATION_REJECTED]: 'Application Update',
  [EMAIL_TEMPLATES.PAYMENT_CONFIRMED]: 'Payment Confirmed',
  [EMAIL_TEMPLATES.EXAM_SCHEDULED]: 'Exam Scheduled',
  [EMAIL_TEMPLATES.EXAM_ASSIGNMENT]: 'Exam Seat Assignment',
  [EMAIL_TEMPLATES.RESULT_PUBLISHED]: 'Results Published',
} as const;

export default { NOTIFICATION_MESSAGES, EMAIL_TEMPLATES, EMAIL_SUBJECTS };