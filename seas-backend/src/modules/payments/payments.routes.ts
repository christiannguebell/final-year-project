import { Router } from 'express';
import { paymentsController } from './payments.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { upload } from '../../middlewares/upload.middleware';
import { uploadLimiter } from '../../middlewares/security.middleware';
import { createPaymentSchema, verifyPaymentSchema, applicationIdParamSchema, idParamSchema } from './payments.validation';
import { auditMiddleware } from '../../middlewares/audit.middleware';
import { AuditAction } from '../../common/logger/audit';


const router: Router = Router();

router.post(
  '/',
  authenticate,
  auditMiddleware(AuditAction.CREATE),
  validate(createPaymentSchema),
  paymentsController.create
);


router.post(
  '/:id/receipt',
  authenticate,
  uploadLimiter,
  upload.single('receipt'),
  paymentsController.uploadReceipt
);


router.get(
  '/application/:applicationId',
  authenticate,
  validate(applicationIdParamSchema, 'params'),
  paymentsController.getByApplication
);

router.patch(
  '/:id/verify',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.VERIFY),
  validate(idParamSchema, 'params'),
  validate(verifyPaymentSchema),
  paymentsController.verify
);


router.delete(
  '/:id',
  authenticate,
  auditMiddleware(AuditAction.DELETE),
  validate(idParamSchema, 'params'),
  paymentsController.delete
);


export default router;