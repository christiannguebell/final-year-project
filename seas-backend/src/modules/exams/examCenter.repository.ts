import { AppDataSource } from '../../database';
import { ExamCenter } from '../../database';

export interface CreateExamCenterDto {
  name: string;
  address: string;
  city: string;
  capacity: number;
}

export const examCentersRepository = {
  async findById(id: string): Promise<ExamCenter | null> {
    return AppDataSource.getRepository(ExamCenter).findOne({ where: { id } as any });
  },

  async findByName(name: string): Promise<ExamCenter | null> {
    return AppDataSource.getRepository(ExamCenter).findOne({ where: { name } as any });
  },

  async findAll(activeOnly = true): Promise<ExamCenter[]> {
    const where = activeOnly ? { isActive: true } : {};
    return AppDataSource.getRepository(ExamCenter).find({
      where: where as any,
      order: { name: 'ASC' },
    });
  },

  async create(data: CreateExamCenterDto): Promise<ExamCenter> {
    const repo = AppDataSource.getRepository(ExamCenter);
    const center = repo.create(data as any);
    return await repo.save(center) as unknown as ExamCenter;
  },

  async update(id: string, data: Partial<ExamCenter>): Promise<ExamCenter | null> {
    await AppDataSource.getRepository(ExamCenter).update(id, data as any);
    return this.findById(id);
  },

  async updateActive(id: string, isActive: boolean): Promise<ExamCenter | null> {
    await AppDataSource.getRepository(ExamCenter).update(id, { isActive } as any);
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await AppDataSource.getRepository(ExamCenter).delete(id);
    return (result.affected ?? 0) > 0;
  },

  async getAvailableCapacity(centerId: string): Promise<number> {
    const center = await this.findById(centerId);
    return center?.capacity || 0;
  },
};

export default examCentersRepository;