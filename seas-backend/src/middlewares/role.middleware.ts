import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../common/errors/ApiError';
import { JwtPayload } from './auth.middleware';
import { UserRole } from '../database/entities/User';

export const authorize = (...allowedRoles: (UserRole | string)[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user as JwtPayload | undefined;

    if (!user) {
      throw ApiError.unauthorized('User not authenticated');
    }

    if (!allowedRoles.includes(user.role)) {
      throw ApiError.forbidden('Insufficient permissions');
    }

    next();
  };
};

export const isAdmin = authorize(UserRole.ADMIN);
export const isCandidate = authorize(UserRole.CANDIDATE);
export const isAdminOrCandidate = authorize(UserRole.ADMIN, UserRole.CANDIDATE);

export default { authorize, isAdmin, isCandidate, isAdminOrCandidate };