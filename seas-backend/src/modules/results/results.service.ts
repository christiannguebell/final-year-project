import { resultsRepository } from './results.repository';
import { resultScoresRepository } from './resultScore.repository';
import { ApiError } from '../../common/errors/ApiError';
import { Result, ResultStatus, ExamAssignment } from '../../database';
import { AppDataSource } from '../../database';
import { RESULT_MESSAGES } from './results.constants';

interface CreateResultData {
  applicationId: string;
}

interface ScoreData {
  subject: string;
  score?: number;
  maxScore?: number;
}

interface EnterScoresData {
  applicationId: string;
  scores: ScoreData[];
}

export const resultsService = {
  async createResult(data: CreateResultData): Promise<Result> {
    const existing = await resultsRepository.findByApplicationId(data.applicationId);
    if (existing) {
      throw ApiError.conflict('Result already exists for this application');
    }
    return await resultsRepository.create(data);
  },

  async getResultById(id: string): Promise<Result> {
    const result = await resultsRepository.findById(id);
    if (!result) {
      throw ApiError.notFound(RESULT_MESSAGES.NOT_FOUND);
    }
    return result;
  },

  async getResultByApplication(applicationId: string): Promise<Result> {
    const result = await resultsRepository.findByApplicationId(applicationId);
    if (!result) {
      throw ApiError.notFound(RESULT_MESSAGES.NOT_FOUND);
    }
    return result;
  },

  async getResultsBySession(sessionId: string): Promise<Result[]> {
    return await resultsRepository.findBySessionId(sessionId);
  },

  async getAllResults(status?: ResultStatus): Promise<Result[]> {
    return await resultsRepository.findAll(status);
  },

  async enterScores(data: EnterScoresData): Promise<Result> {
    const result = await resultsRepository.findByApplicationId(data.applicationId);
    if (!result) {
      throw ApiError.notFound(RESULT_MESSAGES.NOT_FOUND);
    }

    await resultScoresRepository.deleteByResultId(result.id);

    const scoreData = data.scores.map((s) => ({
      resultId: result.id,
      subject: s.subject,
      score: s.score,
      maxScore: s.maxScore,
    }));

    await resultScoresRepository.createMany(scoreData);

    const scores = await resultScoresRepository.findByResultId(result.id);
    const totalScore = scores.reduce((sum, s) => sum + (s.score || 0), 0);
    const maxTotal = scores.reduce((sum, s) => sum + (s.maxScore || 0), 0);

    const updated = await resultsRepository.update(result.id, {
      totalScore,
    } as any);

    return updated!;
  },

  async updateResult(id: string, data: Partial<Result>): Promise<Result> {
    const result = await resultsRepository.findById(id);
    if (!result) {
      throw ApiError.notFound(RESULT_MESSAGES.NOT_FOUND);
    }
    return (await resultsRepository.update(id, data))!;
  },

  async publishResult(id: string): Promise<Result> {
    const result = await resultsRepository.findById(id);
    if (!result) {
      throw ApiError.notFound(RESULT_MESSAGES.NOT_FOUND);
    }
    return (await resultsRepository.updateStatus(id, ResultStatus.PUBLISHED))!;
  },

  async publishSessionResults(sessionId: string): Promise<{ published: number }> {
    const results = await resultsRepository.findBySessionId(sessionId);
    if (results.length === 0) {
      throw ApiError.notFound('No results found for this session');
    }

    const published = await resultsRepository.publishResults(sessionId);
    return { published };
  },

  async deleteResult(id: string): Promise<void> {
    const result = await resultsRepository.findById(id);
    if (!result) {
      throw ApiError.notFound(RESULT_MESSAGES.NOT_FOUND);
    }
    await resultScoresRepository.deleteByResultId(id);
    await resultsRepository.delete(id);
  },

  async getMyResult(userId: string): Promise<Result> {
    const applications = await AppDataSource.getRepository(ExamAssignment)
      .createQueryBuilder('ea')
      .innerJoin('ea.application', 'app')
      .where('app.userId = :userId', { userId })
      .getMany();

    if (applications.length === 0) {
      throw ApiError.notFound(RESULT_MESSAGES.NOT_FOUND);
    }

    const applicationIds = applications.map((a) => a.applicationId);
    const result = await resultsRepository.findAll();
    const myResult = result.find((r) => applicationIds.includes(r.applicationId));

    if (!myResult) {
      throw ApiError.notFound(RESULT_MESSAGES.NOT_FOUND);
    }

    return myResult;
  },
};

export default resultsService;