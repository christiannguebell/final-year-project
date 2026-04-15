import Joi from 'joi';

export const createAcademicRecordSchema = Joi.object({
  applicationId: Joi.string().uuid().required(),
  institution: Joi.string().required(),
  degree: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).optional(),
  grade: Joi.string().optional(),
  fieldOfStudy: Joi.string().required(),
});

export const updateAcademicRecordSchema = Joi.object({
  institution: Joi.string().optional(),
  degree: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().greater(Joi.ref('startDate')).optional(),
  grade: Joi.string().optional(),
  fieldOfStudy: Joi.string().optional(),
});
