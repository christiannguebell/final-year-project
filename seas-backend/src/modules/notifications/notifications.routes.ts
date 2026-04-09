import { Router } from 'express';
import { notificationsController } from './notifications.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { idParamSchema, createNotificationSchema, broadcastSchema, sendTemplatedEmailSchema, limitQuerySchema } from './notifications.validation';

const router: Router = Router();

/**
 * @openapi
 * /api/notifications:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Create a direct notification (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *               - message
 *             properties:
 *               userId:
 *                 type: string
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [SYSTEM, INFO, WARNING, SUCCESS, ERROR]
 *     responses:
 *       201:
 *         description: Notification created
 */
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createNotificationSchema),
  notificationsController.createNotification
);

/**
 * @openapi
 * /api/notifications/my:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Get current user's notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get(
  '/my',
  authenticate,
  validate(limitQuerySchema, 'query'),
  notificationsController.getMyNotifications
);

/**
 * @openapi
 * /api/notifications/unread:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Get unread count and notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread notifications
 */
router.get(
  '/unread',
  authenticate,
  notificationsController.getUnreadNotifications
);

/**
 * @openapi
 * /api/notifications/{id}:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Get notification by ID
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
 *         description: Notification details
 */
router.get(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  notificationsController.getNotificationById
);

/**
 * @openapi
 * /api/notifications/{id}/read:
 *   put:
 *     tags:
 *       - Notifications
 *     summary: Mark notification as read
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
 *         description: Notification marked as read
 */
router.put(
  '/:id/read',
  authenticate,
  validate(idParamSchema, 'params'),
  notificationsController.markAsRead
);

/**
 * @openapi
 * /api/notifications/read-all:
 *   put:
 *     tags:
 *       - Notifications
 *     summary: Mark all notifications as read
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put(
  '/read-all',
  authenticate,
  notificationsController.markAllAsRead
);

/**
 * @openapi
 * /api/notifications/{id}:
 *   delete:
 *     tags:
 *       - Notifications
 *     summary: Delete notification
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
 *         description: Notification deleted
 */
router.delete(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  notificationsController.deleteNotification
);

/**
 * @openapi
 * /api/notifications/broadcast:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Broadcast notification to multiple users (Admin only)
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
 *               role:
 *                 type: string
 *                 enum: [ADMIN, CANDIDATE]
 *     responses:
 *       200:
 *         description: Broadcast successful
 */
router.post(
  '/broadcast',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(broadcastSchema),
  notificationsController.broadcast
);

/**
 * @openapi
 * /api/notifications/email/{userId}:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Send templated email (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               - templateName
 *               - subject
 *             properties:
 *               templateName:
 *                 type: string
 *               subject:
 *                 type: string
 *               context:
 *                 type: object
 *     responses:
 *       200:
 *         description: Email sent
 */
router.post(
  '/email/:userId',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(sendTemplatedEmailSchema),
  notificationsController.sendTemplatedEmail
);

export default router;