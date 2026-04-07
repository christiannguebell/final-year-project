import Joi from 'joi';

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const uploadDocumentSchema = Joi.object({
  applicationId: Joi.string().uuid().required(),
  type: Joi.string().valid('id_card', 'passport', 'photo', 'certificate', 'transcript', 'other').required(),
});

export const verifyDocumentSchema = Joi.object({
  status: Joi.string().valid('pending', 'verified', 'rejected').required(),
  notes: Joi.string().max(500).optional(),
});

export const applicationIdParamSchema = Joi.object({
  applicationId: Joi.string().uuid().required(),
});

export default {
  idParamSchema,
  uploadDocumentSchema,
  verifyDocumentSchema,
  applicationIdParamSchema,
};