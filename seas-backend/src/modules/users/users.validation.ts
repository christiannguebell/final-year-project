import Joi from 'joi';

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
  phone: Joi.string().max(20).optional(),
  status: Joi.string().valid('active', 'inactive', 'pending').optional(),
  role: Joi.string().valid('admin', 'candidate').optional(),
});

export const listUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(100).optional(),
  status: Joi.string().valid('active', 'inactive', 'pending').optional(),
  role: Joi.string().valid('admin', 'candidate').optional(),
});

export default {
  idParamSchema,
  updateUserSchema,
  listUsersSchema,
};