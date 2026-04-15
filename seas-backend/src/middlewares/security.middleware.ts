import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import config from '../config';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    errors: null,
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
      errors: null,
      data: null,
    });
  },
});

export const authLimiter = rateLimit({
  windowMs: config.nodeEnv === 'development' ? 60 * 1000 : 15 * 60 * 1000,
  max: config.nodeEnv === 'development' ? 100 : 10,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    errors: null,
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later.',
      errors: null,
      data: null,
    });
  },
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many upload requests, please try again later.',
    errors: null,
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many upload requests, please try again later.',
      errors: null,
      data: null,
    });
  },
});

export default {
  generalLimiter,
  authLimiter,
  uploadLimiter,
};
