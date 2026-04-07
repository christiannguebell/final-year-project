import Joi from 'joi';

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const createProgramSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  code: Joi.string().min(1).max(50).required(),
  description: Joi.string().max(2000).optional(),
  durationYears: Joi.number().integer().positive().required(),
  entryRequirements: Joi.string().max(5000).optional(),
});

export const updateProgramSchema = Joi.object({
  name: Joi.string().min(1).max(200).optional(),
  description: Joi.string().max(2000).optional(),
  durationYears: Joi.number().integer().positive().optional(),
  entryRequirements: Joi.string().max(5000).optional(),
});

export const listProgramsSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').optional(),
});

export default {
  idParamSchema,
  createProgramSchema,
  updateProgramSchema,
  listProgramsSchema,
};