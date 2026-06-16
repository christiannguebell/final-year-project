import { resultsRepository } from './results.repository';
import { resultScoresRepository } from './resultScore.repository';
import { ApiError } from '../../common/errors/ApiError';
import { Result, ResultStatus, ExamAssignment, Application, User, ExamSession } from '../../database';
import { AppDataSource } from '../../database';
import { RESULT_MESSAGES } from './results.constants';
import { generateResultReportPdf } from '../exams/pdf.service';

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
    let result = await resultsRepository.findByApplicationId(data.applicationId);

    if (!result) {
      const app = await AppDataSource.getRepository(Application).findOne({
        where: { id: data.applicationId } as any,
      });
      if (!app) {
        throw ApiError.notFound('Application not found. Cannot enter scores without a valid application.');
      }
      result = await resultsRepository.create({ applicationId: data.applicationId });
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

    const updated = await resultsRepository.update(result.id, {
      totalScore,
    } as any);

    return updated!;
  },

  async bulkUploadScoresFromCsv(filePath: string, sessionId?: string): Promise<{ created: number; updated: number; errors: string[] }> {
    const fs = await import('fs');
    const { parse } = await import('csv-parse/sync');
    const content = fs.readFileSync(filePath, 'utf-8');
    const records: any[] = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    let created = 0;
    let updated = 0;
    const errors: string[] = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNum = i + 2;
      try {
        const applicationId = row.application_id || row.applicationId || row.ApplicationID || row.applicationid;
        if (!applicationId) {
          errors.push(`Row ${rowNum}: Missing application identifier`);
          continue;
        }

        let result = await resultsRepository.findByApplicationId(applicationId);

        if (!result) {
          const app = await AppDataSource.getRepository(Application).findOne({
            where: { id: applicationId } as any,
          });
          if (!app) {
            errors.push(`Row ${rowNum}: Application ${applicationId} not found`);
            continue;
          }
          result = await resultsRepository.create({ applicationId });
          created++;
        } else {
          updated++;
        }

        const subjects = this.extractSubjectScores(row);
        if (subjects.length > 0) {
          await resultScoresRepository.deleteByResultId(result.id);
          const scoreData = subjects.map((s) => ({
            resultId: result.id,
            subject: s.subject,
            score: s.score,
            maxScore: s.maxScore,
          }));
          await resultScoresRepository.createMany(scoreData);

          const scores = await resultScoresRepository.findByResultId(result.id);
          const totalScore = scores.reduce((sum, s) => sum + (s.score || 0), 0);
          await resultsRepository.update(result.id, { totalScore } as any);
        } else {
          errors.push(`Row ${rowNum}: No subject scores found in row`);
        }
      } catch (err: any) {
        errors.push(`Row ${rowNum}: ${err.message}`);
      }
    }

    return { created, updated, errors };
  },

  extractSubjectScores(row: Record<string, string>): { subject: string; score?: number; maxScore?: number }[] {
    const scores: { subject: string; score?: number; maxScore?: number }[] = [];
    for (const [key, value] of Object.entries(row)) {
      const lowerKey = key.toLowerCase().trim();
      if (['application_id', 'applicationid', 'application', 'candidate', 'candidatenumber', 'candidate_number', 'session', 'sessionid', 'session_id'].includes(lowerKey)) {
        continue;
      }
      const numVal = parseFloat(value);
      if (!isNaN(numVal) && value.trim().length > 0) {
        scores.push({
          subject: key.trim(),
          score: numVal,
          maxScore: 100,
        });
      }
    }
    return scores;
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

  async getMyResultReportPdf(userId: string): Promise<Buffer> {
    const result = await this.getMyResult(userId);
    const fullResult = await resultsRepository.findById(result.id);
    if (!fullResult) {
      throw ApiError.notFound(RESULT_MESSAGES.NOT_FOUND);
    }

    const application = await AppDataSource.getRepository(Application).findOne({
      where: { id: fullResult.applicationId } as any,
      relations: ['program', 'candidate'],
    });

    if (!application) {
      throw ApiError.notFound('Application not found for result');
    }

    const user =
      application.candidate ||
      (await AppDataSource.getRepository(User).findOne({
        where: { id: userId } as any,
      }));

    return generateResultReportPdf(fullResult, user, application.program);
  },
};

export default resultsService;