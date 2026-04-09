import { notificationsRepository } from './notifications.repository';
import { ApiError } from '../../common/errors/ApiError';
import { Notification, NotificationType, NotificationStatus, NotificationChannel } from '../../database';
import { NOTIFICATION_MESSAGES, EMAIL_TEMPLATES, EMAIL_SUBJECTS } from './notifications.constants';
import { emailService } from '../../services/email.service';
import { emailTemplateService } from '../../services/email-template.service';
import { AppDataSource } from '../../database';
import { User } from '../../database';

interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  channel?: NotificationChannel;
  title?: string;
  message?: string;
  templateId?: string;
  templateData?: Record<string, any>;
  link?: string;
}

interface BroadcastData {
  type: NotificationType;
  channel?: NotificationChannel;
  title?: string;
  message?: string;
  templateId?: string;
  templateData?: Record<string, any>;
  link?: string;
  userIds?: string[];
}

export const notificationsService = {
  async createNotification(data: CreateNotificationData): Promise<Notification> {
    const notification = await notificationsRepository.create({
      userId: data.userId,
      type: data.type,
      channel: data.channel || NotificationChannel.IN_APP,
      title: data.title || '',
      message: data.message || '',
      templateId: data.templateId,
      templateData: data.templateData,
      link: data.link,
    });

    if (data.channel === NotificationChannel.EMAIL || (!data.channel && data.templateId)) {
      await this.sendEmailNotification(notification);
    }

    return notification;
  },

  async sendEmailNotification(notification: Notification): Promise<void> {
    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: notification.userId } as any,
      });

      if (!user?.email) {
        throw new Error('User email not found');
      }

      if (notification.templateId && emailTemplateService.hasTemplate(notification.templateId)) {
        await emailService.sendTemplatedEmail({
          to: user.email,
          template: notification.templateId,
          data: {
            ...notification.templateData,
            name: user.firstName || user.email,
            resetUrl: notification.link,
            expiryHours: 1,
          },
          subject: EMAIL_SUBJECTS[notification.templateId as keyof typeof EMAIL_SUBJECTS] || 'SEAS Notification',
        });
      } else {
        await emailService.sendMail({
          to: user.email,
          subject: notification.title || 'SEAS Notification',
          html: `<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">${notification.title}</h2>
            <div style="color: #666; line-height: 1.6;">${notification.message}</div>
            ${notification.link ? `<p><a href="${notification.link}" style="color: #007bff;">Click here for more details</a></p>` : ''}
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">This is an automated message from SEAS. Please do not reply to this email.</p>
          </div>`,
        });
      }
    } catch (error) {
      throw ApiError.internal(NOTIFICATION_MESSAGES.EMAIL_FAILED);
    }
  },

  async getNotificationById(id: string): Promise<Notification> {
    const notification = await notificationsRepository.findById(id);
    if (!notification) {
      throw ApiError.notFound(NOTIFICATION_MESSAGES.NOT_FOUND);
    }
    return notification;
  },

  async getUserNotifications(userId: string, limit = 50): Promise<Notification[]> {
    return await notificationsRepository.findByUserId(userId, limit);
  },

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return await notificationsRepository.findUnreadByUserId(userId);
  },

  async markAsRead(id: string): Promise<Notification> {
    const notification = await notificationsRepository.findById(id);
    if (!notification) {
      throw ApiError.notFound(NOTIFICATION_MESSAGES.NOT_FOUND);
    }
    return (await notificationsRepository.markAsRead(id))!;
  },

  async markAllAsRead(userId: string): Promise<{ marked: number }> {
    const marked = await notificationsRepository.markAllAsRead(userId);
    return { marked };
  },

  async deleteNotification(id: string): Promise<void> {
    const notification = await notificationsRepository.findById(id);
    if (!notification) {
      throw ApiError.notFound(NOTIFICATION_MESSAGES.NOT_FOUND);
    }
    await notificationsRepository.delete(id);
  },

  async broadcast(data: BroadcastData): Promise<{ sent: number; emailsSent: number }> {
    let sent = 0;
    let emailsSent = 0;

    if (data.userIds && data.userIds.length > 0) {
      const notifications = data.userIds.map((userId) => ({
        userId,
        type: data.type,
        channel: data.channel || NotificationChannel.IN_APP,
        title: data.title || '',
        message: data.message || '',
        templateId: data.templateId,
        templateData: data.templateData,
        link: data.link,
      }));
      await notificationsRepository.createMany(notifications);
      sent = notifications.length;

      if (data.channel === NotificationChannel.EMAIL || data.templateId) {
        for (const userId of data.userIds) {
          const user = await AppDataSource.getRepository(User).findOne({
            where: { id: userId } as any,
          });
          if (user?.email) {
            try {
              if (data.templateId && emailTemplateService.hasTemplate(data.templateId)) {
                await emailService.sendTemplatedEmail({
                  to: user.email,
                  template: data.templateId,
                  data: {
                    ...data.templateData,
                    name: user.firstName || user.email,
                    resetUrl: data.link,
                    expiryHours: 1,
                  },
                  subject: EMAIL_SUBJECTS[data.templateId as keyof typeof EMAIL_SUBJECTS] || 'SEAS Notification',
                });
              } else {
                await emailService.sendMail({
                  to: user.email,
                  subject: data.title || 'Notification',
                  html: `<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">${data.title}</h2>
                    <div style="color: #666; line-height: 1.6;">${data.message}</div>
                    ${data.link ? `<p><a href="${data.link}" style="color: #007bff;">Click here for more details</a></p>` : ''}
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">This is an automated message from SEAS.</p>
                  </div>`,
                });
              }
              emailsSent++;
            } catch (error) {
              // Continue with other emails
            }
          }
        }
      }
    }
    return { sent, emailsSent };
  },

  async sendTemplatedEmail(
    userId: string,
    templateId: string,
    templateData: Record<string, any>,
    link?: string
  ): Promise<Notification> {
    if (!Object.values(EMAIL_TEMPLATES).includes(templateId as any)) {
      throw ApiError.badRequest('Invalid template ID');
    }

    if (!emailTemplateService.hasTemplate(templateId)) {
      throw ApiError.badRequest('Template not found');
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId } as any,
    });

    return await this.createNotification({
      userId,
      type: NotificationType.SYSTEM,
      channel: NotificationChannel.EMAIL,
      title: EMAIL_SUBJECTS[templateId as keyof typeof EMAIL_SUBJECTS] || 'SEAS Notification',
      message: '',
      templateId,
      templateData: {
        ...templateData,
        name: user?.firstName || user?.email || 'User',
        resetUrl: link,
        expiryHours: 1,
      },
      link,
    });
  },
};

export default notificationsService;