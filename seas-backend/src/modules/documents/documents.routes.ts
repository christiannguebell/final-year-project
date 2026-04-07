import { Router } from 'express';
import { documentsController } from './documents.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { upload } from '../../middlewares/upload.middleware';
import { uploadDocumentSchema, verifyDocumentSchema, applicationIdParamSchema, idParamSchema } from './documents.validation';

const router: Router = Router();

router.post(
  '/upload',
  authenticate,
  upload.single('document'),
  validate(uploadDocumentSchema),
  documentsController.upload
);

router.get(
  '/application/:applicationId',
  authenticate,
  validate(applicationIdParamSchema, 'params'),
  documentsController.getByApplication
);

router.patch(
  '/:id/verify',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  validate(verifyDocumentSchema),
  documentsController.verify
);

router.delete(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  documentsController.delete
);

export default router;