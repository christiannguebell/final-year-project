import { Request, Response, NextFunction } from 'express';
import { notificationsService } from './notifications.service';
import { successResponse } from '../../common/utils';
import { NotificationType } from '../../database';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

const getParam = (param: unknown): string => {
  if (typeof param === 'string') return param;
  if (Array.isArray(param)) return param[0];
  return '';
};

export const notificationsController = {
  async createNotification(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId, type, channel, title, message, templateId, templateData, link } = req.body;
      const notification = await notificationsService.createNotification({
        userId,
        type,
        channel,
        title,
        message,
        templateId,
        templateData,
        link,
      });
      res.status(201).json(successResponse(notification, 'Notification created'));
    } catch (error) {
      next(error);
    }
  },

  async getNotificationById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const notification = await notificationsService.getNotificationById(id);
      res.status(200).json(successResponse(notification));
    } catch (error) {
      next(error);
    }
  },

  async getMyNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const limit = parseInt(getParam(req.query.limit)) || 50;
      const notifications = await notificationsService.getUserNotifications(userId, limit);
      res.status(200).json(successResponse(notifications));
    } catch (error) {
      next(error);
    }
  },

  async getUnreadNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const notifications = await notificationsService.getUnreadNotifications(userId);
      res.status(200).json(successResponse(notifications));
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const notification = await notificationsService.markAsRead(id);
      res.status(200).json(successResponse(notification, 'Notification marked as read'));
    } catch (error) {
      next(error);
    }
  },

  async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const result = await notificationsService.markAllAsRead(userId);
      res.status(200).json(successResponse(result, 'All notifications marked as read'));
    } catch (error) {
      next(error);
    }
  },

  async deleteNotification(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      await notificationsService.deleteNotification(id);
      res.status(200).json(successResponse(null, 'Notification deleted'));
    } catch (error) {
      next(error);
    }
  },

  async broadcast(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type, channel, title, message, templateId, templateData, link, userIds } = req.body;
      const result = await notificationsService.broadcast({
        type,
        channel,
        title,
        message,
        templateId,
        templateData,
        link,
        userIds,
      });
      res.status(200).json(successResponse(result, 'Notifications broadcast'));
    } catch (error) {
      next(error);
    }
  },

  async sendTemplatedEmail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = getParam(req.params.userId);
      const { templateId, templateData, link } = req.body;
      const notification = await notificationsService.sendTemplatedEmail(
        userId,
        templateId,
        templateData,
        link
      );
      res.status(201).json(successResponse(notification, 'Templated email sent'));
    } catch (error) {
      next(error);
    }
  },
};

export default notificationsController;