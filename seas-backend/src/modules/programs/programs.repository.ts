import { AppDataSource } from '../../database';
import { Program, ProgramStatus } from '../../database';

export interface CreateProgramDto {
  name: string;
  code: string;
  description?: string;
  durationYears: number;
  entryRequirements?: string;
}

export const programsRepository = {
  async findById(id: string): Promise<Program | null> {
    return AppDataSource.getRepository(Program).findOne({ where: { id } as any });
  },

  async findByCode(code: string): Promise<Program | null> {
    return AppDataSource.getRepository(Program).findOne({ where: { code } as any });
  },

  async findAll(status?: ProgramStatus): Promise<Program[]> {
    const where = status ? { status } : {};
    return AppDataSource.getRepository(Program).find({ where } as any);
  },

  async create(data: CreateProgramDto): Promise<Program> {
    const repo = AppDataSource.getRepository(Program);
    const program = repo.create({
      ...data,
      status: ProgramStatus.ACTIVE,
    } as any);
    return await repo.save(program) as unknown as Program;
  },

  async update(id: string, data: Partial<Program>): Promise<Program | null> {
    await AppDataSource.getRepository(Program).update(id, data as any);
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await AppDataSource.getRepository(Program).delete(id);
    return (result.affected ?? 0) > 0;
  },

  async existsByCode(code: string): Promise<boolean> {
    const count = await AppDataSource.getRepository(Program).count({
      where: { code } as any,
    });
    return count > 0;
  },
};

export default programsRepository;