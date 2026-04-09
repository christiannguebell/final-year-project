import { programsService } from '../../../src/modules/programs/programs.service';
import { programsRepository } from '../../../src/modules/programs/programs.repository';
import { ApiError } from '../../../src/common/errors/ApiError';
import { ProgramStatus } from '../../../src/database';
import { PROGRAM_MESSAGES } from '../../../src/modules/programs/programs.constants';

jest.mock('../../../src/modules/programs/programs.repository');

describe('ProgramsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw conflict error if program code exists', async () => {
      (programsRepository.existsByCode as jest.Mock).mockResolvedValue(true);

      await expect(
        programsService.create({
          name: 'Computer Science',
          code: 'CS101',
          durationYears: 4,
        })
      ).rejects.toThrow(ApiError);
    });

    it('should create program successfully', async () => {
      (programsRepository.existsByCode as jest.Mock).mockResolvedValue(false);
      (programsRepository.create as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Computer Science',
        code: 'CS101',
        status: ProgramStatus.ACTIVE,
      });

      const result = await programsService.create({
        name: 'Computer Science',
        code: 'CS101',
        durationYears: 4,
      });

      expect(result.name).toBe('Computer Science');
    });
  });

  describe('getAll', () => {
    it('should return all programs', async () => {
      const mockPrograms = [
        { id: '1', name: 'Program 1', status: ProgramStatus.ACTIVE },
        { id: '2', name: 'Program 2', status: ProgramStatus.ACTIVE },
      ];
      (programsRepository.findAll as jest.Mock).mockResolvedValue(mockPrograms);

      const result = await programsService.getAll();

      expect(result).toHaveLength(2);
    });

    it('should filter programs by status', async () => {
      (programsRepository.findAll as jest.Mock).mockResolvedValue([]);

      await programsService.getAll(ProgramStatus.INACTIVE);

      expect(programsRepository.findAll).toHaveBeenCalledWith(ProgramStatus.INACTIVE);
    });
  });

  describe('getById', () => {
    it('should return program by id', async () => {
      const mockProgram = { id: '1', name: 'Test Program' };
      (programsRepository.findById as jest.Mock).mockResolvedValue(mockProgram);

      const result = await programsService.getById('1');

      expect(result.name).toBe('Test Program');
    });

    it('should throw not found error', async () => {
      (programsRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(programsService.getById('999')).rejects.toThrow(ApiError);
    });
  });

  describe('update', () => {
    it('should update program', async () => {
      const mockProgram = { id: '1', name: 'Old Name' };
      (programsRepository.findById as jest.Mock).mockResolvedValue(mockProgram);
      (programsRepository.update as jest.Mock).mockResolvedValue({
        ...mockProgram,
        name: 'New Name',
      });

      const result = await programsService.update('1', { name: 'New Name' });

      expect(result.name).toBe('New Name');
    });
  });

  describe('activate', () => {
    it('should activate program', async () => {
      const mockProgram = { id: '1', status: ProgramStatus.INACTIVE };
      (programsRepository.findById as jest.Mock).mockResolvedValue(mockProgram);
      (programsRepository.update as jest.Mock).mockResolvedValue(true);

      await programsService.activate('1');

      expect(programsRepository.update).toHaveBeenCalledWith('1', { status: ProgramStatus.ACTIVE });
    });

    it('should throw error if already active', async () => {
      const mockProgram = { id: '1', status: ProgramStatus.ACTIVE };
      (programsRepository.findById as jest.Mock).mockResolvedValue(mockProgram);

      await expect(programsService.activate('1')).rejects.toThrow('Program is already active');
    });
  });

  describe('deactivate', () => {
    it('should deactivate program', async () => {
      const mockProgram = { id: '1', status: ProgramStatus.ACTIVE };
      (programsRepository.findById as jest.Mock).mockResolvedValue(mockProgram);
      (programsRepository.update as jest.Mock).mockResolvedValue(true);

      await programsService.deactivate('1');

      expect(programsRepository.update).toHaveBeenCalledWith('1', { status: ProgramStatus.INACTIVE });
    });
  });

  describe('delete', () => {
    it('should delete program', async () => {
      const mockProgram = { id: '1' };
      (programsRepository.findById as jest.Mock).mockResolvedValue(mockProgram);
      (programsRepository.delete as jest.Mock).mockResolvedValue(true);

      await programsService.delete('1');

      expect(programsRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});