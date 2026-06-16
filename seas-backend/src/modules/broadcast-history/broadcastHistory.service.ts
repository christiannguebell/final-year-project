import { broadcastHistoryRepository } from './broadcastHistory.repository';
import { BroadcastHistory, BroadcastChannel, NotificationType, NotificationChannel } from '../../database';
import { ApiError } from '../../common/errors/ApiError';
import { BROADCAST_MESSAGES } from './broadcastHistory.constants';
import { notificationsService } from '../notifications/notifications.service';

interface BroadcastInput {
  title: string;
  message: string;
  channel?: BroadcastChannel;
  type?: NotificationType;
  templateId?: string;
  templateData?: Record<string, any>;
  link?: string;
  userIds?: string[];
  filters?: {
    programId?: string;
    applicationStatus?: string;
    paymentStatus?: string;
    hasPaid?: boolean;
    hasApplication?: boolean;
  };
  sentBy: string;
}

export const broadcastHistoryService = {
  async getAll(page = 1, limit = 20): Promise<{ data: BroadcastHistory[]; total: number }> {
    return await broadcastHistoryRepository.findAll(page, limit);
  },

  async getById(id: string): Promise<BroadcastHistory> {
    const record = await broadcastHistoryRepository.findById(id);
    if (!record) {
      throw ApiError.notFound(BROADCAST_MESSAGES.NOT_FOUND);
    }
    return record;
  },

  async broadcast(data: BroadcastInput): Promise<{ broadcast: BroadcastHistory; notification: { sent: number; emailsSent: number } }> {
    const channel = data.channel || BroadcastChannel.IN_APP;
    const notifChannel = channel === BroadcastChannel.EMAIL ? NotificationChannel.EMAIL : NotificationChannel.IN_APP;

    const notification = await notificationsService.broadcast({
      type: data.type || NotificationType.SYSTEM,
      channel: notifChannel,
      title: data.title,
      message: data.message,
      templateId: data.templateId,
      templateData: data.templateData,
      link: data.link,
      userIds: data.userIds,
      filters: data.filters,
    });

    const record = await broadcastHistoryRepository.create({
      title: data.title,
      message: data.message,
      channel,
      targetAudience: data.filters ? JSON.stringify(data.filters) : (data.userIds ? `specific (${data.userIds.length} users)` : 'all'),
      recipientCount: notification.sent,
      emailSentCount: notification.emailsSent,
      sentBy: data.sentBy,
      filters: data.filters as Record<string, any> | undefined,
      templateId: data.templateId,
      templateData: data.templateData,
    });

    return { broadcast: record, notification };
  },

  async delete(id: string): Promise<void> {
    const record = await broadcastHistoryRepository.findById(id);
    if (!record) {
      throw ApiError.notFound(BROADCAST_MESSAGES.NOT_FOUND);
    }
    await broadcastHistoryRepository.delete(id);
  },
};
