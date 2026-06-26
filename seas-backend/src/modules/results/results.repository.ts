import { AppDataSource } from '../../database';
import { Result, ResultStatus } from '../../database';

export interface CreateResultDto {
  applicationId: string;
}

export interface UpdateResultDto {
  totalScore?: number;
  rank?: number;
  status?: ResultStatus;
}

export const resultsRepository = {
  async findById(id: string): Promise<Result | null> {
    return AppDataSource.getRepository(Result).findOne({
      where: { id } as any,
      relations: ['application', 'application.candidate', 'scores'],
    });
  },

  async findByApplicationId(applicationId: string): Promise<Result | null> {
    return AppDataSource.getRepository(Result).findOne({
      where: { applicationId } as any,
      relations: ['scores'],
    });
  },

  async findBySessionId(sessionId: string): Promise<Result[]> {
    return AppDataSource.getRepository(Result)
      .createQueryBuilder('result')
      .leftJoinAndSelect('result.application', 'application')
      .leftJoinAndSelect('application.candidate', 'candidate')
      .leftJoinAndSelect('result.scores', 'scores')
      .leftJoin('exam_assignments', 'ea', 'ea.application_id = application.id')
      .where('ea.session_id = :sessionId', { sessionId })
      .orderBy('result.totalScore', 'DESC')
      .getMany();
  },

  async findAll(status?: ResultStatus): Promise<Result[]> {
    const where = status ? { status } : {};
    return AppDataSource.getRepository(Result).find({
      where: where as any,
      relations: ['application', 'application.candidate', 'scores'],
      order: { totalScore: 'DESC' },
    });
  },

  async create(data: CreateResultDto): Promise<Result> {
    const repo = AppDataSource.getRepository(Result);
    const result = repo.create({
      ...data,
      status: ResultStatus.PENDING,
    } as any);
    return await repo.save(result) as unknown as Result;
  },

  async update(id: string, data: UpdateResultDto): Promise<Result | null> {
    await AppDataSource.getRepository(Result).update(id, data as any);
    return this.findById(id);
  },

  async updateStatus(id: string, status: ResultStatus): Promise<Result | null> {
    const updateData: any = { status };
    if (status === ResultStatus.PUBLISHED) {
      updateData.publishedAt = new Date();
    }
    await AppDataSource.getRepository(Result).update(id, updateData);
    return this.findById(id);
  },

  async publishResults(sessionId: string): Promise<number> {
    const results = await this.findBySessionId(sessionId);
    const total = results.length;
    let rank = 1;
    for (const result of results) {
      const percentile = total > 1 ? Math.round(((total - rank) / (total - 1)) * 100) : 100;
      await AppDataSource.getRepository(Result).update(result.id, {
        status: ResultStatus.PUBLISHED,
        rank,
        percentile,
        publishedAt: new Date(),
      } as any);
      rank++;
    }
    return total;
  },

  async delete(id: string): Promise<boolean> {
    const result = await AppDataSource.getRepository(Result).delete(id);
    return (result.affected ?? 0) > 0;
  },
};

export default resultsRepository;