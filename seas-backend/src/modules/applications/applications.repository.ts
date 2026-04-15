import { AppDataSource } from '../../database';
import { Application, ApplicationStatus } from '../../database';

export interface CreateApplicationDto {
  userId: string;
  programId: string;
  personalStatement?: string;
}

export interface UpdateApplicationDto {
  programId?: string;
  personalStatement?: string;
}

export const applicationsRepository = {
  async findById(id: string): Promise<Application | null> {
    return AppDataSource.getRepository(Application).findOne({
      where: { id } as any,
      relations: ['candidate', 'candidate.profile', 'program', 'academicRecords', 'documents', 'payments'],
    });
  },

  async findByUserId(userId: string): Promise<Application[]> {
    return AppDataSource.getRepository(Application).find({
      where: { userId } as any,
      relations: ['program'],
      order: { createdAt: 'DESC' },
    });
  },

  async findAll(status?: ApplicationStatus): Promise<Application[]> {
    const where = status ? { status } : {};
    return AppDataSource.getRepository(Application).find({
      where: where as any,
      relations: ['candidate', 'program'],
      order: { createdAt: 'DESC' },
    });
  },

  async create(data: CreateApplicationDto): Promise<Application> {
    const repo = AppDataSource.getRepository(Application);
    const application = repo.create({
      ...data,
      status: ApplicationStatus.DRAFT,
    } as any);
    return await repo.save(application) as unknown as Application;
  },

  async update(id: string, data: UpdateApplicationDto): Promise<Application | null> {
    await AppDataSource.getRepository(Application).update(id, data as any);
    return this.findById(id);
  },

  async updateStatus(id: string, status: ApplicationStatus): Promise<Application | null> {
    await AppDataSource.getRepository(Application).update(id, { status } as any);
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await AppDataSource.getRepository(Application).delete(id);
    return (result.affected ?? 0) > 0;
  },

  async existsByUserAndProgram(userId: string, programId: string): Promise<boolean> {
    const count = await AppDataSource.getRepository(Application).count({
      where: { userId, programId } as any,
    });
    return count > 0;
  },
};

export default applicationsRepository;