import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../common/errors/ApiError';
import logger from '../common/logger';

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    logger.error(`API Error: ${err.message}`, {
      statusCode: err.statusCode,
      stack: err.stack,
    });

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
      errors: err.errors,
    });
    return;
  }

  logger.error(`Unexpected Error: ${err.message}`, {
    stack: err.stack,
  });

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    data: null,
    errors: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    data: null,
  });
};

export default { errorHandler, notFoundHandler };