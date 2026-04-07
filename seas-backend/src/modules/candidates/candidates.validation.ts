import Joi from 'joi';

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const createCandidateSchema = Joi.object({
  dateOfBirth: Joi.date().iso().optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  nationality: Joi.string().max(100).optional(),
  address: Joi.string().max(500).optional(),
  city: Joi.string().max(100).optional(),
  country: Joi.string().max(100).optional(),
});

export const updateCandidateSchema = Joi.object({
  dateOfBirth: Joi.date().iso().optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  nationality: Joi.string().max(100).optional(),
  address: Joi.string().max(500).optional(),
  city: Joi.string().max(100).optional(),
  country: Joi.string().max(100).optional(),
});

export default {
  idParamSchema,
  createCandidateSchema,
  updateCandidateSchema,
};