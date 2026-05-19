import Joi from 'joi';

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const createPaymentSchema = Joi.object({
  applicationId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  paymentDate: Joi.date().iso().required(),
  method: Joi.string().valid('BANK_TRANSFER', 'MOBILE_MONEY', 'CASH').required(),
  transactionId: Joi.string().max(100).optional(),
});

export const uploadReceiptSchema = Joi.object({
  transactionId: Joi.string().max(100).optional(),
  amount: Joi.number().positive().optional(),
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
  uploadReceiptSchema,
  verifyPaymentSchema,
  applicationIdParamSchema,
};