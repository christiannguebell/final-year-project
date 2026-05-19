import { Router } from 'express';
import { paymentsController } from './payments.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { upload } from '../../middlewares/upload.middleware';
import { uploadLimiter } from '../../middlewares/security.middleware';
import { createPaymentSchema, uploadReceiptSchema, verifyPaymentSchema, applicationIdParamSchema, idParamSchema } from './payments.validation';
import { auditMiddleware } from '../../middlewares/audit.middleware';
import { AuditAction } from '../../common/logger/audit';


const router: Router = Router();

/**
 * @openapi
 * /api/payments:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Initiate payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicationId
 *               - amount
 *               - method
 *             properties:
 *               applicationId:
 *                 type: string
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *                 enum: [BANK_TRANSFER, MOBILE_MONEY, CASH]
 *     responses:
 *       201:
 *         description: Payment initiated
 */
router.post(
  '/',
  authenticate,
  auditMiddleware(AuditAction.CREATE),
  validate(createPaymentSchema),
  paymentsController.create
);

/**
 * @openapi
 * /api/payments/{id}/receipt:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Upload payment receipt
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - receipt
 *             properties:
 *               receipt:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Receipt uploaded
 */
router.post(
  '/:id/receipt',
  authenticate,
  uploadLimiter,
  upload.single('receipt'),
  validate(uploadReceiptSchema),
  paymentsController.uploadReceipt
);

/**
 * @openapi
 * /api/payments/application/{applicationId}:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Get payments for an application
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
 *         description: List of payments
 */
router.get(
  '/application/:applicationId',
  authenticate,
  validate(applicationIdParamSchema, 'params'),
  paymentsController.getByApplication
);

/**
 * @openapi
 * /api/payments/{id}/verify:
 *   patch:
 *     tags:
 *       - Payments
 *     summary: Verify payment (Admin only)
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
 *         description: Payment verified
 */
router.patch(
  '/:id/verify',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.VERIFY),
  validate(idParamSchema, 'params'),
  validate(verifyPaymentSchema),
  paymentsController.verify
);

/**
 * @openapi
 * /api/payments/{id}:
 *   delete:
 *     tags:
 *       - Payments
 *     summary: Delete payment
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
 *         description: Payment deleted
 */
router.delete(
  '/:id',
  authenticate,
  auditMiddleware(AuditAction.DELETE),
  validate(idParamSchema, 'params'),
  paymentsController.delete
);


export default router;