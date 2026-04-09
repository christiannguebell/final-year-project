import { resultsService } from '../../../src/modules/results/results.service';
import { resultsRepository } from '../../../src/modules/results/results.repository';
import { resultScoresRepository } from '../../../src/modules/results/resultScore.repository';
import { ApiError } from '../../../src/common/errors/ApiError';
import { RESULT_MESSAGES } from '../../../src/modules/results/results.constants';
import { AppDataSource, ResultStatus } from '../../../src/database';

jest.mock('../../../src/modules/results/results.repository');
jest.mock('../../../src/modules/results/resultScore.repository');
jest.mock('../../../src/database', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      createQueryBuilder: jest.fn().mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
      }),
    }),
  },
  ResultStatus: {
    PENDING: 'pending',
    PUBLISHED: 'published',
  },
}));

describe('ResultsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createResult', () => {
    it('should throw conflict if result exists', async () => {
      (resultsRepository.findByApplicationId as jest.Mock).mockResolvedValue({ id: '1' });

      await expect(
        resultsService.createResult({ applicationId: 'app1' })
      ).rejects.toThrow(ApiError);
    });

    it('should create result successfully', async () => {
      (resultsRepository.findByApplicationId as jest.Mock).mockResolvedValue(null);
      (resultsRepository.create as jest.Mock).mockResolvedValue({
        id: '1',
        applicationId: 'app1',
        status: ResultStatus.PENDING,
      });

      const result = await resultsService.createResult({ applicationId: 'app1' });

      expect(result.applicationId).toBe('app1');
    });
  });

  describe('getResultById', () => {
    it('should return result by id', async () => {
      (resultsRepository.findById as jest.Mock).mockResolvedValue({ id: '1' });

      const result = await resultsService.getResultById('1');

      expect(result.id).toBe('1');
    });

    it('should throw not found error', async () => {
      (resultsRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(resultsService.getResultById('999')).rejects.toThrow(
        RESULT_MESSAGES.NOT_FOUND
      );
    });
  });

  describe('getResultByApplication', () => {
    it('should return result by application id', async () => {
      (resultsRepository.findByApplicationId as jest.Mock).mockResolvedValue({
        id: '1',
        applicationId: 'app1',
      });

      const result = await resultsService.getResultByApplication('app1');

      expect(result.applicationId).toBe('app1');
    });
  });

  describe('getAllResults', () => {
    it('should return all results', async () => {
      (resultsRepository.findAll as jest.Mock).mockResolvedValue([
        { id: '1' },
        { id: '2' },
      ]);

      const result = await resultsService.getAllResults();

      expect(result).toHaveLength(2);
    });
  });

  describe('enterScores', () => {
    it('should enter scores and calculate total', async () => {
      const mockResult = { id: '1', applicationId: 'app1' };
      const mockScores = [
        { subject: 'Math', score: 80, maxScore: 100 },
        { subject: 'English', score: 90, maxScore: 100 },
      ];

      (resultsRepository.findByApplicationId as jest.Mock).mockResolvedValue(mockResult);
      (resultScoresRepository.deleteByResultId as jest.Mock).mockResolvedValue(true);
      (resultScoresRepository.createMany as jest.Mock).mockResolvedValue(true);
      (resultScoresRepository.findByResultId as jest.Mock).mockResolvedValue(mockScores);
      (resultsRepository.update as jest.Mock).mockResolvedValue({
        ...mockResult,
        totalScore: 170,
      });

      const result = await resultsService.enterScores({
        applicationId: 'app1',
        scores: mockScores,
      });

      expect(result.totalScore).toBe(170);
    });
  });

  describe('publishResult', () => {
    it('should publish result', async () => {
      (resultsRepository.findById as jest.Mock).mockResolvedValue({ id: '1' });
      (resultsRepository.updateStatus as jest.Mock).mockResolvedValue({
        id: '1',
        status: ResultStatus.PUBLISHED,
      });

      const result = await resultsService.publishResult('1');

      expect(result.status).toBe(ResultStatus.PUBLISHED);
    });
  });

  describe('publishSessionResults', () => {
    it('should publish all results for session', async () => {
      (resultsRepository.findBySessionId as jest.Mock).mockResolvedValue([
        { id: '1' },
        { id: '2' },
      ]);
      (resultsRepository.publishResults as jest.Mock).mockResolvedValue(2);

      const result = await resultsService.publishSessionResults('session1');

      expect(result.published).toBe(2);
    });
  });

  describe('getMyResult', () => {
    it('should return result for user', async () => {
      const mockAssignments = [{ applicationId: 'app1' }];
      const mockResults = [
        { id: '1', applicationId: 'app1', totalScore: 150 },
      ];

      (AppDataSource.getRepository as jest.Mock)().createQueryBuilder.mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockAssignments),
      });
      (resultsRepository.findAll as jest.Mock).mockResolvedValue(mockResults);

      const result = await resultsService.getMyResult('user1');

      expect(result.totalScore).toBe(150);
    });

    it('should throw not found if no result', async () => {
      (AppDataSource.getRepository as jest.Mock)().createQueryBuilder.mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });

      await expect(resultsService.getMyResult('user1')).rejects.toThrow(
        RESULT_MESSAGES.NOT_FOUND
      );
    });
  });
});