import Joi from 'joi';

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const applicationIdParamSchema = Joi.object({
  applicationId: Joi.string().uuid().required(),
});

export const sessionIdParamSchema = Joi.object({
  sessionId: Joi.string().uuid().required(),
});

export const createResultSchema = Joi.object({
  applicationId: Joi.string().uuid().required(),
});

export const enterScoresSchema = Joi.object({
  applicationId: Joi.string().uuid().required(),
  scores: Joi.array()
    .items(
      Joi.object({
        subject: Joi.string().min(1).max(100).required(),
        score: Joi.number().min(0).optional(),
        maxScore: Joi.number().min(1).optional(),
      })
    )
    .min(1)
    .required(),
});

export const updateResultSchema = Joi.object({
  totalScore: Joi.number().min(0).optional(),
  rank: Joi.number().integer().min(1).optional(),
  status: Joi.string().valid('pending', 'published').optional(),
});

export const publishSessionSchema = Joi.object({
  sessionId: Joi.string().uuid().required(),
});

export default {
  idParamSchema,
  applicationIdParamSchema,
  sessionIdParamSchema,
  createResultSchema,
  enterScoresSchema,
  updateResultSchema,
  publishSessionSchema,
};