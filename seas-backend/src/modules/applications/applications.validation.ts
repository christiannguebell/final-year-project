import Joi from 'joi';

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const createApplicationSchema = Joi.object({
  programId: Joi.string().uuid().required(),
  personalStatement: Joi.string().max(5000).optional(),
});

export const updateApplicationSchema = Joi.object({
  programId: Joi.string().uuid().optional(),
  personalStatement: Joi.string().max(5000).optional(),
});

export const listApplicationsSchema = Joi.object({
  status: Joi.string().valid('draft', 'submitted', 'under_review', 'approved', 'rejected').optional(),
});

export default {
  idParamSchema,
  createApplicationSchema,
  updateApplicationSchema,
  listApplicationsSchema,
};