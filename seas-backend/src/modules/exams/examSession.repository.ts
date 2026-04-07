import { AppDataSource } from '../../database';
import { ExamSession, ExamSessionStatus } from '../../database';

export interface CreateExamSessionDto {
  name: string;
  examDate: Date;
  registrationStart?: Date;
  registrationEnd?: Date;
  description?: string;
}

export const examSessionsRepository = {
  async findById(id: string): Promise<ExamSession | null> {
    return AppDataSource.getRepository(ExamSession).findOne({ where: { id } as any });
  },

  async findByName(name: string): Promise<ExamSession | null> {
    return AppDataSource.getRepository(ExamSession).findOne({ where: { name } as any });
  },

  async findAll(status?: ExamSessionStatus): Promise<ExamSession[]> {
    const where = status ? { status } : {};
    return AppDataSource.getRepository(ExamSession).find({
      where: where as any,
      order: { examDate: 'DESC' },
    });
  },

  async create(data: CreateExamSessionDto): Promise<ExamSession> {
    const repo = AppDataSource.getRepository(ExamSession);
    const session = repo.create({
      ...data,
      status: ExamSessionStatus.SCHEDULED,
    } as any);
    return await repo.save(session) as unknown as ExamSession;
  },

  async update(id: string, data: Partial<ExamSession>): Promise<ExamSession | null> {
    await AppDataSource.getRepository(ExamSession).update(id, data as any);
    return this.findById(id);
  },

  async updateStatus(id: string, status: ExamSessionStatus): Promise<ExamSession | null> {
    await AppDataSource.getRepository(ExamSession).update(id, { status } as any);
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await AppDataSource.getRepository(ExamSession).delete(id);
    return (result.affected ?? 0) > 0;
  },
};

export default examSessionsRepository;