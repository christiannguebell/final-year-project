import Joi from 'joi';

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const createNotificationSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  type: Joi.string().valid('application', 'payment', 'exam', 'result', 'system').required(),
  channel: Joi.string().valid('in_app', 'email').optional(),
  title: Joi.string().min(1).max(200).optional(),
  message: Joi.string().min(1).max(2000).optional(),
  templateId: Joi.string().valid(
    'application_approved',
    'application_rejected',
    'payment_confirmed',
    'exam_scheduled',
    'exam_assignment',
    'result_published',
    'password_reset',
    'email_verification'
  ).optional(),
  templateData: Joi.object().optional(),
  link: Joi.string().uri().optional(),
});

export const broadcastSchema = Joi.object({
  type: Joi.string().valid('application', 'payment', 'exam', 'result', 'system').required(),
  channel: Joi.string().valid('in_app', 'email').optional(),
  title: Joi.string().min(1).max(200).optional(),
  message: Joi.string().min(1).max(2000).optional(),
  templateId: Joi.string().valid(
    'application_approved',
    'application_rejected',
    'payment_confirmed',
    'exam_scheduled',
    'exam_assignment',
    'result_published',
    'password_reset',
    'email_verification'
  ).optional(),
  templateData: Joi.object().optional(),
  link: Joi.string().uri().optional(),
  userIds: Joi.array().items(Joi.string().uuid()).optional(),
  filters: Joi.object({
    programId: Joi.string().uuid().optional(),
    applicationStatus: Joi.string().valid('draft', 'submitted', 'under_review', 'approved', 'rejected').optional(),
    paymentStatus: Joi.string().valid('pending', 'verified', 'rejected').optional(),
    hasPaid: Joi.boolean().optional(),
    hasApplication: Joi.boolean().optional(),
  }).optional(),
});

export const sendTemplatedEmailSchema = Joi.object({
  templateId: Joi.string().valid(
    'application_approved',
    'application_rejected',
    'payment_confirmed',
    'exam_scheduled',
    'exam_assignment',
    'result_published',
    'password_reset',
    'email_verification'
  ).required(),
  templateData: Joi.object().required(),
  link: Joi.string().uri().optional(),
});

export const limitQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).optional(),
});

export default {
  idParamSchema,
  createNotificationSchema,
  broadcastSchema,
  sendTemplatedEmailSchema,
  limitQuerySchema,
};