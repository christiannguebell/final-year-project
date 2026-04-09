import { Router } from 'express';
import { usersController } from './users.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { auditMiddleware } from '../../middlewares/audit.middleware';
import { AuditAction } from '../../common/logger/audit';
import { idParamSchema, updateUserSchema, listUsersSchema } from './users.validation';

const router: Router = Router();


router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(listUsersSchema, 'query'),
  usersController.getAll
);

router.get(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  usersController.getById
);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  validate(updateUserSchema),
  usersController.update
);


router.patch(
  '/:id/activate',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  usersController.activate
);


router.patch(
  '/:id/deactivate',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  usersController.deactivate
);


router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.DELETE),
  validate(idParamSchema, 'params'),
  usersController.delete
);


export default router;