import Joi from 'joi';

export const createAcademicRecordSchema = Joi.object({
  applicationId: Joi.string().uuid().required(),
  institution: Joi.string().required(),
  degree: Joi.string().required(),
  startDate: Joi.date().optional().allow('', null),
  endDate: Joi.date().optional().allow('', null),
  grade: Joi.string().optional().allow(''),
  fieldOfStudy: Joi.string().optional().allow(''),
});

export const updateAcademicRecordSchema = Joi.object({
  institution: Joi.string().optional(),
  degree: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().greater(Joi.ref('startDate')).optional(),
  grade: Joi.string().optional(),
  fieldOfStudy: Joi.string().optional(),
});
