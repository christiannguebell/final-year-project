import Joi from 'joi';

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const createSessionSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  examDate: Joi.date().iso().required(),
  registrationStart: Joi.date().iso().optional(),
  registrationEnd: Joi.date().iso().optional(),
  description: Joi.string().max(2000).optional(),
});

export const updateSessionSchema = Joi.object({
  name: Joi.string().min(1).max(200).optional(),
  examDate: Joi.date().iso().optional(),
  registrationStart: Joi.date().iso().optional(),
  registrationEnd: Joi.date().iso().optional(),
  description: Joi.string().max(2000).optional(),
  status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'cancelled').optional(),
});

export const createCenterSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  address: Joi.string().min(1).max(500).required(),
  city: Joi.string().min(1).max(100).required(),
  capacity: Joi.number().integer().positive().required(),
});

export const updateCenterSchema = Joi.object({
  name: Joi.string().min(1).max(200).optional(),
  address: Joi.string().min(1).max(500).optional(),
  city: Joi.string().min(1).max(100).optional(),
  capacity: Joi.number().integer().positive().optional(),
  isActive: Joi.boolean().optional(),
});

export const autoAllocateSchema = Joi.object({
  sessionId: Joi.string().uuid().required(),
});

export default {
  idParamSchema,
  createSessionSchema,
  updateSessionSchema,
  createCenterSchema,
  updateCenterSchema,
  autoAllocateSchema,
};