import { applicationsService } from '../../../src/modules/applications/applications.service';
import { applicationsRepository } from '../../../src/modules/applications/applications.repository';
import { ApiError } from '../../../src/common/errors/ApiError';
import { ApplicationStatus, UserRole } from '../../../src/database';
import { APPLICATION_MESSAGES } from '../../../src/modules/applications/applications.constants';

jest.mock('../../../src/modules/applications/applications.repository');

describe('ApplicationsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw conflict if application exists', async () => {
      (applicationsRepository.existsByUserAndProgram as jest.Mock).mockResolvedValue(true);

      await expect(
        applicationsService.create({ userId: '1', programId: 'prog1' })
      ).rejects.toThrow(ApiError);
    });

    it('should create application successfully', async () => {
      (applicationsRepository.existsByUserAndProgram as jest.Mock).mockResolvedValue(false);
      (applicationsRepository.create as jest.Mock).mockResolvedValue({
        id: '1',
        userId: '1',
        programId: 'prog1',
        status: ApplicationStatus.DRAFT,
      });

      const result = await applicationsService.create({ userId: '1', programId: 'prog1' });

      expect(result.status).toBe(ApplicationStatus.DRAFT);
    });
  });

  describe('getMyApplications', () => {
    it('should return user applications', async () => {
      const mockApps = [{ id: '1', userId: '1' }, { id: '2', userId: '1' }];
      (applicationsRepository.findByUserId as jest.Mock).mockResolvedValue(mockApps);

      const result = await applicationsService.getMyApplications('1');

      expect(result).toHaveLength(2);
    });
  });

  describe('getById', () => {
    it('should return application for owner', async () => {
      const mockApp = { id: '1', userId: '1', status: ApplicationStatus.DRAFT };
      (applicationsRepository.findById as jest.Mock).mockResolvedValue(mockApp);

      const result = await applicationsService.getById('1', '1', UserRole.CANDIDATE);

      expect(result.id).toBe('1');
    });

    it('should allow admin to access any application', async () => {
      const mockApp = { id: '1', userId: '2', status: ApplicationStatus.DRAFT };
      (applicationsRepository.findById as jest.Mock).mockResolvedValue(mockApp);

      const result = await applicationsService.getById('1', 'admin', UserRole.ADMIN);

      expect(result.id).toBe('1');
    });

    it('should throw forbidden for non-owner', async () => {
      const mockApp = { id: '1', userId: '2', status: ApplicationStatus.DRAFT };
      (applicationsRepository.findById as jest.Mock).mockResolvedValue(mockApp);

      await expect(
        applicationsService.getById('1', '1', UserRole.CANDIDATE)
      ).rejects.toThrow(ApiError);
    });
  });

  describe('update', () => {
    it('should update draft application', async () => {
      const mockApp = { id: '1', userId: '1', status: ApplicationStatus.DRAFT };
      (applicationsRepository.findById as jest.Mock).mockResolvedValue(mockApp);
      (applicationsRepository.update as jest.Mock).mockResolvedValue({
        ...mockApp,
        personalStatement: 'Updated statement',
      });

      const result = await applicationsService.update('1', '1', UserRole.CANDIDATE, {
        personalStatement: 'Updated statement',
      });

      expect(result.personalStatement).toBe('Updated statement');
    });

    it('should throw error for non-draft application', async () => {
      const mockApp = { id: '1', userId: '1', status: ApplicationStatus.SUBMITTED };
      (applicationsRepository.findById as jest.Mock).mockResolvedValue(mockApp);

      await expect(
        applicationsService.update('1', '1', UserRole.CANDIDATE, {})
      ).rejects.toThrow(APPLICATION_MESSAGES.CANNOT_EDIT);
    });
  });

  describe('submit', () => {
    it('should submit draft application', async () => {
      const mockApp = { id: '1', userId: '1', status: ApplicationStatus.DRAFT };
      (applicationsRepository.findById as jest.Mock).mockResolvedValue(mockApp);
      (applicationsRepository.updateStatus as jest.Mock).mockResolvedValue({
        ...mockApp,
        status: ApplicationStatus.SUBMITTED,
      });

      const result = await applicationsService.submit('1', '1');

      expect(result.status).toBe(ApplicationStatus.SUBMITTED);
    });
  });

  describe('approve', () => {
    it('should approve submitted application', async () => {
      const mockApp = { id: '1', status: ApplicationStatus.SUBMITTED };
      (applicationsRepository.findById as jest.Mock).mockResolvedValue(mockApp);
      (applicationsRepository.updateStatus as jest.Mock).mockResolvedValue({
        ...mockApp,
        status: ApplicationStatus.APPROVED,
      });

      const result = await applicationsService.approve('1');

      expect(result.status).toBe(ApplicationStatus.APPROVED);
    });
  });

  describe('reject', () => {
    it('should reject submitted application', async () => {
      const mockApp = { id: '1', status: ApplicationStatus.SUBMITTED };
      (applicationsRepository.findById as jest.Mock).mockResolvedValue(mockApp);
      (applicationsRepository.updateStatus as jest.Mock).mockResolvedValue({
        ...mockApp,
        status: ApplicationStatus.REJECTED,
      });

      const result = await applicationsService.reject('1');

      expect(result.status).toBe(ApplicationStatus.REJECTED);
    });
  });

  describe('getAll', () => {
    it('should return all applications', async () => {
      (applicationsRepository.findAll as jest.Mock).mockResolvedValue([]);

      await applicationsService.getAll();

      expect(applicationsRepository.findAll).toHaveBeenCalledWith(undefined);
    });
  });
});