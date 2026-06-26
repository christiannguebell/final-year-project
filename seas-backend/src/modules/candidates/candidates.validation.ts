import Joi from 'joi';

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const createCandidateSchema = Joi.object({
  dateOfBirth: Joi.date().iso().optional().allow(''),
  gender: Joi.string().valid('male', 'female', 'other', '').optional(),
  nationality: Joi.string().max(100).optional().allow(''),
  address: Joi.string().max(500).optional().allow(''),
  city: Joi.string().max(100).optional().allow(''),
  country: Joi.string().max(100).optional().allow(''),
});

export const updateCandidateSchema = Joi.object({
  dateOfBirth: Joi.date().iso().optional().allow(''),
  gender: Joi.string().valid('male', 'female', 'other', '').optional(),
  nationality: Joi.string().max(100).optional().allow(''),
  address: Joi.string().max(500).optional().allow(''),
  city: Joi.string().max(100).optional().allow(''),
  country: Joi.string().max(100).optional().allow(''),
  idType: Joi.string().max(50).optional().allow(''),
  idNumber: Joi.string().max(100).optional().allow(''),
  zipCode: Joi.string().max(20).optional().allow(''),
});

export default {
  idParamSchema,
  createCandidateSchema,
  updateCandidateSchema,
};