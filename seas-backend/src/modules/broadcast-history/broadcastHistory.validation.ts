import Joi from 'joi';

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const broadcastSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  message: Joi.string().min(1).max(5000).required(),
  channel: Joi.string().valid('in_app', 'email', 'both').optional(),
  type: Joi.string().valid('application', 'payment', 'exam', 'result', 'system').optional(),
  templateId: Joi.string().optional(),
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

export default {
  idParamSchema,
  broadcastSchema,
};
