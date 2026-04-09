import { Router } from 'express';
import { documentsController } from './documents.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { upload } from '../../middlewares/upload.middleware';
import { uploadLimiter } from '../../middlewares/security.middleware';
import { uploadDocumentSchema, verifyDocumentSchema, applicationIdParamSchema, idParamSchema } from './documents.validation';
import { auditMiddleware } from '../../middlewares/audit.middleware';
import { AuditAction } from '../../common/logger/audit';


const router: Router = Router();

router.post(
  '/upload',
  authenticate,
  uploadLimiter,
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
  auditMiddleware(AuditAction.VERIFY),
  validate(idParamSchema, 'params'),
  validate(verifyDocumentSchema),
  documentsController.verify
);


router.delete(
  '/:id',
  authenticate,
  auditMiddleware(AuditAction.DELETE),
  validate(idParamSchema, 'params'),
  documentsController.delete
);


export default router;