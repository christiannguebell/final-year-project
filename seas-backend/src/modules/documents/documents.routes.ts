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

/**
 * @openapi
 * /api/documents/upload:
 *   post:
 *     tags:
 *       - Documents
 *     summary: Upload document
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *               - applicationId
 *               - type
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *               applicationId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [BIRTH_CERTIFICATE, DIPLOMA, TRANSCRIPT, ID_CARD, OTHER]
 *     responses:
 *       201:
 *         description: Document uploaded
 */
router.post(
  '/upload',
  authenticate,
  uploadLimiter,
  upload.single('document'),
  validate(uploadDocumentSchema),
  documentsController.upload
);

/**
 * @openapi
 * /api/documents/application/{applicationId}:
 *   get:
 *     tags:
 *       - Documents
 *     summary: Get documents for an application
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of documents
 */
router.get(
  '/application/:applicationId',
  authenticate,
  validate(applicationIdParamSchema, 'params'),
  documentsController.getByApplication
);

/**
 * @openapi
 * /api/documents/{id}/verify:
 *   patch:
 *     tags:
 *       - Documents
 *     summary: Verify document (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [VERIFIED, REJECTED]
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Document status updated
 */
router.patch(
  '/:id/verify',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.VERIFY),
  validate(idParamSchema, 'params'),
  validate(verifyDocumentSchema),
  documentsController.verify
);

/**
 * @openapi
 * /api/documents/{id}:
 *   delete:
 *     tags:
 *       - Documents
 *     summary: Delete document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Document deleted
 */
router.delete(
  '/:id',
  authenticate,
  auditMiddleware(AuditAction.DELETE),
  validate(idParamSchema, 'params'),
  documentsController.delete
);


export default router;