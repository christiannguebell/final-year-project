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
  if (req.body) {
    req.body = sanitize(req.body) as typeof req.body;
  }

  if (req.query) {
    req.query = sanitize(req.query) as typeof req.query;
  }

  if (req.params) {
    req.params = sanitize(req.params) as typeof req.params;
  }

  next();
};

export default sanitizeInput;