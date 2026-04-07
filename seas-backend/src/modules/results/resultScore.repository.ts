import { AppDataSource } from '../../database';
import { ResultScore } from '../../database';

export interface CreateScoreDto {
  resultId: string;
  subject: string;
  score?: number;
  maxScore?: number;
}

export const resultScoresRepository = {
  async findById(id: string): Promise<ResultScore | null> {
    return AppDataSource.getRepository(ResultScore).findOne({ where: { id } as any });
  },

  async findByResultId(resultId: string): Promise<ResultScore[]> {
    return AppDataSource.getRepository(ResultScore).find({
      where: { resultId } as any,
    });
  },

  async create(data: CreateScoreDto): Promise<ResultScore> {
    const repo = AppDataSource.getRepository(ResultScore);
    const score = repo.create(data as any);
    return await repo.save(score) as unknown as ResultScore;
  },

  async createMany(data: CreateScoreDto[]): Promise<ResultScore[]> {
    const repo = AppDataSource.getRepository(ResultScore);
    const scores = repo.create(data as any);
    return await repo.save(scores) as unknown as ResultScore[];
  },

  async update(id: string, data: Partial<CreateScoreDto>): Promise<ResultScore | null> {
    await AppDataSource.getRepository(ResultScore).update(id, data as any);
    return this.findById(id);
  },

  async deleteByResultId(resultId: string): Promise<number> {
    const result = await AppDataSource.getRepository(ResultScore).delete({
      resultId: resultId as any,
    } as any);
    return result.affected || 0;
  },
};

export default resultScoresRepository;