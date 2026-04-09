import { Request, Response, NextFunction } from 'express';

const dangerousPatterns = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
];

const sanitizeString = (input: string): string => {
  let result = input;
  for (const pattern of dangerousPatterns) {
    result = result.replace(pattern, '');
  }
  return result.trim();
};

const sanitize = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  }

  if (typeof obj === 'object') {
    const sanitized: { [key: string]: unknown } = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitize(value);
    }
    return sanitized;
  }

  return obj;
};

export const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    const sanitizedBody = sanitize(req.body);
    Object.assign(req.body, sanitizedBody);
  }

  if (req.query && typeof req.query === 'object') {
    const sanitizedQuery = sanitize(req.query);
    // Since req.query can be read-only in some versions/configs, 
    // we mutate the properties if possible or safely assign.
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        delete (req.query as any)[key];
      }
    }
    Object.assign(req.query, sanitizedQuery);
  }

  if (req.params && typeof req.params === 'object') {
    const sanitizedParams = sanitize(req.params);
    Object.assign(req.params, sanitizedParams);
  }

  next();
};


export default sanitizeInput;