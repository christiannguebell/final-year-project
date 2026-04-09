import { Router } from 'express';
import { programsController } from './programs.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { idParamSchema, createProgramSchema, updateProgramSchema, listProgramsSchema } from './programs.validation';
import { auditMiddleware } from '../../middlewares/audit.middleware';
import { AuditAction } from '../../common/logger/audit';


const router: Router = Router();

router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.CREATE),
  validate(createProgramSchema),
  programsController.create
);


router.get(
  '/',
  authenticate,
  validate(listProgramsSchema, 'query'),
  programsController.getAll
);

router.get(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  programsController.getById
);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  validate(updateProgramSchema),
  programsController.update
);


router.patch(
  '/:id/activate',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  programsController.activate
);


router.patch(
  '/:id/deactivate',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  programsController.deactivate
);


router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.DELETE),
  validate(idParamSchema, 'params'),
  programsController.delete
);


export default router;