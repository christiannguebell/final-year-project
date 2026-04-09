import { candidatesService } from '../../../src/modules/candidates/candidates.service';
import { candidatesRepository } from '../../../src/modules/candidates/candidates.repository';
import { ApiError } from '../../../src/common/errors/ApiError';
import { CANDIDATE_MESSAGES } from '../../../src/modules/candidates/candidates.constants';
import { Gender } from '../../../src/database';

jest.mock('../../../src/modules/candidates/candidates.repository');
jest.mock('../../../src/common/utils/idGenerator', () => ({
  generateCandidateNumber: jest.fn().mockReturnValue('CAND-2024-001'),
}));

describe('CandidatesService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw conflict error if candidate already exists', async () => {
      (candidatesRepository.existsByUserId as jest.Mock).mockResolvedValue(true);

      await expect(candidatesService.create({ userId: '1' })).rejects.toThrow(
        ApiError
      );
    });

    it('should create candidate successfully', async () => {
      (candidatesRepository.existsByUserId as jest.Mock).mockResolvedValue(false);
      (candidatesRepository.create as jest.Mock).mockResolvedValue({
        id: '1',
        userId: '1',
        candidateNumber: 'CAND-2024-001',
      });

      const result = await candidatesService.create({ userId: '1' });

      expect(result.candidateNumber).toBe('CAND-2024-001');
    });
  });

  describe('getById', () => {
    it('should return candidate profile', async () => {
      const mockProfile = { id: '1', userId: '1', candidateNumber: 'CAND-2024-001' };
      (candidatesRepository.findById as jest.Mock).mockResolvedValue(mockProfile);

      const result = await candidatesService.getById('1');

      expect(result.id).toBe('1');
    });

    it('should throw not found error', async () => {
      (candidatesRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(candidatesService.getById('999')).rejects.toThrow(ApiError);
    });
  });

  describe('getByUserId', () => {
    it('should return candidate profile by user id', async () => {
      const mockProfile = { id: '1', userId: '1' };
      (candidatesRepository.findByUserId as jest.Mock).mockResolvedValue(mockProfile);

      const result = await candidatesService.getByUserId('1');

      expect(result.userId).toBe('1');
    });

    it('should throw not found error', async () => {
      (candidatesRepository.findByUserId as jest.Mock).mockResolvedValue(null);

      await expect(candidatesService.getByUserId('999')).rejects.toThrow(ApiError);
    });
  });

  describe('update', () => {
    it('should update candidate profile', async () => {
      const mockProfile = { id: '1', nationality: 'Cameroon' };
      (candidatesRepository.findById as jest.Mock).mockResolvedValue(mockProfile);
      (candidatesRepository.updateById as jest.Mock).mockResolvedValue({
        ...mockProfile,
        nationality: 'Nigeria',
      });

      const result = await candidatesService.update('1', { nationality: 'Nigeria' });

      expect(result.nationality).toBe('Nigeria');
    });

    it('should throw not found error if profile not found', async () => {
      (candidatesRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(candidatesService.update('999', { nationality: 'Nigeria' })).rejects.toThrow(
        ApiError
      );
    });
  });

  describe('updateProfilePhoto', () => {
    it('should update profile photo', async () => {
      const mockProfile = { id: '1', profilePhoto: null };
      (candidatesRepository.findById as jest.Mock).mockResolvedValue(mockProfile);
      (candidatesRepository.updateById as jest.Mock).mockResolvedValue({
        ...mockProfile,
        profilePhoto: '/uploads/photo.jpg',
      });

      const result = await candidatesService.updateProfilePhoto('1', '/uploads/photo.jpg');

      expect(result.profilePhoto).toBe('/uploads/photo.jpg');
    });
  });

  describe('delete', () => {
    it('should delete candidate profile', async () => {
      const mockProfile = { id: '1' };
      (candidatesRepository.findById as jest.Mock).mockResolvedValue(mockProfile);
      (candidatesRepository.deleteProfile as jest.Mock).mockResolvedValue(true);

      await candidatesService.delete('1');

      expect(candidatesRepository.deleteProfile).toHaveBeenCalledWith('1');
    });
  });
});