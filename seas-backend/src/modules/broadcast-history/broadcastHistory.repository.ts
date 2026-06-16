import { AppDataSource } from '../../database';
import { BroadcastHistory, BroadcastChannel } from '../../database';

export interface CreateBroadcastDto {
  title: string;
  message: string;
  channel: BroadcastChannel;
  targetAudience?: string;
  recipientCount: number;
  emailSentCount: number;
  sentBy: string;
  filters?: Record<string, any>;
  templateId?: string;
  templateData?: Record<string, any>;
}

export const broadcastHistoryRepository = {
  async findById(id: string): Promise<BroadcastHistory | null> {
    return AppDataSource.getRepository(BroadcastHistory).findOne({
      where: { id } as any,
    });
  },

  async findAll(page = 1, limit = 20): Promise<{ data: BroadcastHistory[]; total: number }> {
    const [data, total] = await AppDataSource.getRepository(BroadcastHistory).findAndCount({
      order: { sentAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  },

  async create(data: CreateBroadcastDto): Promise<BroadcastHistory> {
    const repo = AppDataSource.getRepository(BroadcastHistory);
    const record = repo.create(data as any);
    return await repo.save(record) as unknown as BroadcastHistory;
  },

  async delete(id: string): Promise<boolean> {
    const result = await AppDataSource.getRepository(BroadcastHistory).delete(id);
    return (result.affected ?? 0) > 0;
  },
};
