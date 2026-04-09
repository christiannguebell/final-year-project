import { Router } from 'express';
import { applicationsController } from './applications.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { idParamSchema, createApplicationSchema, updateApplicationSchema, listApplicationsSchema } from './applications.validation';
import { auditMiddleware } from '../../middlewares/audit.middleware';
import { AuditAction } from '../../common/logger/audit';


const router: Router = Router();

router.post(
  '/',
  authenticate,
  validate(createApplicationSchema),
  applicationsController.create
);

router.get(
  '/mine',
  authenticate,
  applicationsController.getMyApplications
);

router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(listApplicationsSchema, 'query'),
  applicationsController.getAll
);

router.get(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  applicationsController.getById
);

router.put(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  validate(updateApplicationSchema),
  applicationsController.update
);

router.post(
  '/:id/submit',
  authenticate,
  validate(idParamSchema, 'params'),
  applicationsController.submit
);

router.patch(
  '/:id/approve',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.APPROVE),
  validate(idParamSchema, 'params'),
  applicationsController.approve
);


router.patch(
  '/:id/reject',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.REJECT),
  validate(idParamSchema, 'params'),
  applicationsController.reject
);


router.delete(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  applicationsController.delete
);

export default router;