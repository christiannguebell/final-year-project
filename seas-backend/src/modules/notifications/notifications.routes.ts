import { Router } from 'express';
import { notificationsController } from './notifications.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { idParamSchema, createNotificationSchema, broadcastSchema, sendTemplatedEmailSchema, limitQuerySchema } from './notifications.validation';

const router: Router = Router();

router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createNotificationSchema),
  notificationsController.createNotification
);

router.get(
  '/my',
  authenticate,
  validate(limitQuerySchema, 'query'),
  notificationsController.getMyNotifications
);

router.get(
  '/unread',
  authenticate,
  notificationsController.getUnreadNotifications
);

router.get(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  notificationsController.getNotificationById
);

router.put(
  '/:id/read',
  authenticate,
  validate(idParamSchema, 'params'),
  notificationsController.markAsRead
);

router.put(
  '/read-all',
  authenticate,
  notificationsController.markAllAsRead
);

router.delete(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  notificationsController.deleteNotification
);

router.post(
  '/broadcast',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(broadcastSchema),
  notificationsController.broadcast
);

router.post(
  '/email/:userId',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(sendTemplatedEmailSchema),
  notificationsController.sendTemplatedEmail
);

export default router;