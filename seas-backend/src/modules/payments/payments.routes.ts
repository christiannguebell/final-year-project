import { Router } from 'express';
import { paymentsController } from './payments.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { upload } from '../../middlewares/upload.middleware';
import { createPaymentSchema, verifyPaymentSchema, applicationIdParamSchema, idParamSchema } from './payments.validation';

const router: Router = Router();

router.post(
  '/',
  authenticate,
  validate(createPaymentSchema),
  paymentsController.create
);

router.post(
  '/:id/receipt',
  authenticate,
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
  validate(idParamSchema, 'params'),
  validate(verifyPaymentSchema),
  paymentsController.verify
);

router.delete(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  paymentsController.delete
);

export default router;