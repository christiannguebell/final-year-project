import { Router } from 'express';
import { broadcastHistoryController } from './broadcastHistory.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { idParamSchema, broadcastSchema } from './broadcastHistory.validation';
import { auditMiddleware } from '../../middlewares/audit.middleware';
import { AuditAction } from '../../common/logger/audit';

const router: Router = Router();

/**
 * @openapi
 * /api/broadcast-history:
 *   get:
 *     tags:
 *       - Broadcast History
 *     summary: List all broadcast history (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of broadcast history
 */
router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  broadcastHistoryController.getAll
);

/**
 * @openapi
 * /api/broadcast-history/{id}:
 *   get:
 *     tags:
 *       - Broadcast History
 *     summary: Get broadcast history by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Broadcast history details
 */
router.get(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  broadcastHistoryController.getById
);

/**
 * @openapi
 * /api/broadcast-history/send:
 *   post:
 *     tags:
 *       - Broadcast History
 *     summary: Send broadcast notification and record history (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               channel:
 *                 type: string
 *                 enum: [in_app, email, both]
 *     responses:
 *       201:
 *         description: Broadcast sent
 */
router.post(
  '/send',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.CREATE),
  validate(broadcastSchema),
  broadcastHistoryController.broadcast
);

/**
 * @openapi
 * /api/broadcast-history/{id}:
 *   delete:
 *     tags:
 *       - Broadcast History
 *     summary: Delete broadcast history record (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Broadcast history deleted
 */
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.DELETE),
  validate(idParamSchema, 'params'),
  broadcastHistoryController.delete
);

export default router;
