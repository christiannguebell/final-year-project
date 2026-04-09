import { Request, Response, NextFunction } from 'express';
import { logAudit, AuditAction } from '../common/logger/audit';
import { JwtPayload } from './auth.middleware';

export const auditMiddleware = (action: AuditAction) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.user) {
      const user = req.user as JwtPayload;
      const ipAddress = req.ip || req.socket.remoteAddress || undefined;
      const userAgent = req.get('user-agent') || undefined;

      logAudit(action, user.userId, user.role, {
        targetType: req.method,
        targetId: typeof req.params.id === 'string' ? req.params.id : undefined,
        ipAddress,
        userAgent,
        details: {
          method: req.method,
          path: req.path,
          query: req.query,
        },
      });
    }
    next();
  };
};

export default auditMiddleware;