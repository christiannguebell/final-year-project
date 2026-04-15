import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../common/errors/ApiError';

export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      throw new ValidationError(errors[0].message, errors);
    }

    // req.query is a getter-only property in newer Express/Node versions,
    // so we must mutate it in-place rather than reassigning it.
    if (property === 'query') {
      Object.keys(req.query).forEach((key) => delete (req.query as Record<string, unknown>)[key]);
      Object.assign(req.query, value);
    } else {
      req[property] = value;
    }
    next();
  };
};

export default { validate };