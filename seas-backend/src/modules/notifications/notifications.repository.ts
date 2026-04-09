import { AppDataSource } from '../../database';
import { Notification, NotificationType, NotificationStatus, NotificationChannel } from '../../database';

export interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  channel?: NotificationChannel;
  title?: string;
  message?: string;
  templateId?: string;
  templateData?: Record<string, any>;
  link?: string;
}

export const notificationsRepository = {
  async findById(id: string): Promise<Notification | null> {
    return AppDataSource.getRepository(Notification).findOne({
      where: { id } as any,
      relations: ['user'],
    });
  },

  async findByUserId(userId: string, limit = 50): Promise<Notification[]> {
    return AppDataSource.getRepository(Notification).find({
      where: { userId } as any,
      order: { createdAt: 'DESC' },
      take: limit,
    });
  },

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    return AppDataSource.getRepository(Notification).find({
      where: { userId, status: NotificationStatus.UNREAD } as any,
      order: { createdAt: 'DESC' },
    });
  },

  async create(data: CreateNotificationDto): Promise<Notification> {
    const repo = AppDataSource.getRepository(Notification);
    const notification = repo.create(data as any);
    return await repo.save(notification) as unknown as Notification;
  },

  async createMany(data: CreateNotificationDto[]): Promise<Notification[]> {
    const repo = AppDataSource.getRepository(Notification);
    const notifications = repo.create(data as any);
    return await repo.save(notifications) as unknown as Notification[];
  },

  async markAsRead(id: string): Promise<Notification | null> {
    await AppDataSource.getRepository(Notification).update(id, {
      status: NotificationStatus.READ,
    } as any);
    return this.findById(id);
  },

  async markAllAsRead(userId: string): Promise<number> {
    const result = await AppDataSource.getRepository(Notification).update(
      { userId, status: NotificationStatus.UNREAD } as any,
      { status: NotificationStatus.READ } as any
    );
    return result.affected || 0;
  },

  async delete(id: string): Promise<boolean> {
    const result = await AppDataSource.getRepository(Notification).delete(id);
    return (result.affected ?? 0) > 0;
  },

  async deleteByUserId(userId: string): Promise<number> {
    const result = await AppDataSource.getRepository(Notification).delete({
      userId: userId as any,
    } as any);
    return result.affected || 0;
  },
};

export default notificationsRepository;