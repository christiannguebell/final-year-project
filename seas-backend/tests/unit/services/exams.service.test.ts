import { examsService } from '../../../src/modules/exams/exams.service';
import { examSessionsRepository } from '../../../src/modules/exams/examSession.repository';
import { examCentersRepository } from '../../../src/modules/exams/examCenter.repository';
import { examAssignmentsRepository } from '../../../src/modules/exams/examAssignment.repository';
import { ApiError } from '../../../src/common/errors/ApiError';
import { EXAM_MESSAGES } from '../../../src/modules/exams/exams.constants';
import { describe, jest } from '@jest/globals';

jest.mock('../../../src/modules/exams/examSession.repository');
jest.mock('../../../src/modules/exams/examCenter.repository');
jest.mock('../../../src/modules/exams/examAssignment.repository');

jest.mock('../../../src/database', () => {
  return {
    AppDataSource: {
      getRepository: jest.fn().mockReturnValue({
        find: jest.fn().mockImplementation(() => Promise.resolve([])),
        createQueryBuilder: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockImplementation(() => Promise.resolve([])),
        }),
      }),
    },
    Application: class {},
    ApplicationStatus: {
      APPROVED: 'approved',
    },
  };
});

describe('ExamsService', () => {
  let mockAppDataSource: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAppDataSource = require('../../../src/database').AppDataSource;
  });

  describe('createSession', () => {
    it('should throw conflict if session name exists', async () => {
      (examSessionsRepository.findByName as any).mockResolvedValue({ id: '1' });

      await expect(
        examsService.createSession({ name: 'Session 2024', examDate: new Date() })
      ).rejects.toThrow(ApiError);
    });

    it('should create session successfully', async () => {
      (examSessionsRepository.findByName as any).mockResolvedValue(null);
      (examSessionsRepository.create as any).mockResolvedValue({
        id: '1',
        name: 'Session 2024',
      });

      const result = await examsService.createSession({
        name: 'Session 2024',
        examDate: new Date(),
      });

      expect(result.name).toBe('Session 2024');
    });
  });

  describe('getSessions', () => {
    it('should return all sessions', async () => {
      (examSessionsRepository.findAll as any).mockResolvedValue([
        { id: '1', name: 'Session 1' },
      ]);

      const result = await examsService.getSessions();

      expect(result).toHaveLength(1);
    });
  });

  describe('getSessionById', () => {
    it('should return session by id', async () => {
      (examSessionsRepository.findById as any).mockResolvedValue({
        id: '1',
        name: 'Test Session',
      });

      const result = await examsService.getSessionById('1');

      expect(result.name).toBe('Test Session');
    });

    it('should throw not found error', async () => {
      (examSessionsRepository.findById as any).mockResolvedValue(null);

      await expect(examsService.getSessionById('999')).rejects.toThrow(
        EXAM_MESSAGES.SESSION_NOT_FOUND
      );
    });
  });

  describe('createCenter', () => {
    it('should create center successfully', async () => {
      (examCentersRepository.findByName as any).mockResolvedValue(null);
      (examCentersRepository.create as any).mockResolvedValue({
        id: '1',
        name: 'Test Center',
      });

      const result = await examsService.createCenter({
        name: 'Test Center',
        address: '123 Test St',
        city: 'Test City',
        capacity: 100,
      });

      expect(result.name).toBe('Test Center');
    });
  });

  describe('getCenters', () => {
    it('should return active centers', async () => {
      (examCentersRepository.findAll as any).mockResolvedValue([
        { id: '1', name: 'Center 1' },
      ]);

      const result = await examsService.getCenters();

      expect(result).toHaveLength(1);
    });
  });

  describe('autoAllocateCandidates', () => {
    it('should throw error if no approved applications', async () => {
      const mockRepo = mockAppDataSource.getRepository();

      (examSessionsRepository.findById as any).mockResolvedValue({ id: '1' });
      (examCentersRepository.findAll as any).mockResolvedValue([{ id: '1', capacity: 100 }]);

      mockRepo.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockImplementation(() => Promise.resolve([])),
      });

      await expect(
        examsService.autoAllocateCandidates({ sessionId: '1' })
      ).rejects.toThrow('No approved applications to assign');
    });

    it('should assign candidates successfully', async () => {
      const mockApplications = [
        { id: 'app1', userId: '1' },
        { id: 'app2', userId: '2' },
      ];
      const mockRepo = mockAppDataSource.getRepository();

      (examSessionsRepository.findById as any).mockResolvedValue({ id: '1', examDate: new Date() });
      (examCentersRepository.findAll as any).mockResolvedValue([{ id: '1', capacity: 100 }]);
      (examAssignmentsRepository.findBySessionId as any).mockResolvedValue([]);
      (examAssignmentsRepository.createMany as any).mockResolvedValue(true);

      mockRepo.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockImplementation(() => Promise.resolve(mockApplications)),
      });

      const result = await examsService.autoAllocateCandidates({
        sessionId: '1',
      });

      expect(result.assigned).toBe(2);
    });
  });

  describe('getMyAssignment', () => {
    it('should return assignment for user', async () => {
      const mockApplications = [{ id: 'app1' }];
      const mockAssignment = { id: '1', applicationId: 'app1', seatNumber: 'S001' };

      mockAppDataSource.getRepository().find.mockResolvedValueOnce(mockApplications);
      (examAssignmentsRepository.findByApplicationId as any).mockResolvedValue(mockAssignment);

      const result = await examsService.getMyAssignment('1');

      expect(result.seatNumber).toBe('S001');
    });

    it('should throw not found if no assignment', async () => {
      mockAppDataSource.getRepository().find.mockResolvedValueOnce([]);

      await expect(examsService.getMyAssignment('1')).rejects.toThrow(
        EXAM_MESSAGES.NO_ASSIGNMENT
      );
    });
  });
});