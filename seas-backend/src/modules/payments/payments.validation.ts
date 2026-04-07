import Joi from 'joi';

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const createPaymentSchema = Joi.object({
  applicationId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  paymentDate: Joi.date().iso().required(),
});

export const verifyPaymentSchema = Joi.object({
  status: Joi.string().valid('pending', 'verified', 'rejected').required(),
  notes: Joi.string().max(500).optional(),
});

export const applicationIdParamSchema = Joi.object({
  applicationId: Joi.string().uuid().required(),
});

export default {
  idParamSchema,
  createPaymentSchema,
  verifyPaymentSchema,
  applicationIdParamSchema,
};