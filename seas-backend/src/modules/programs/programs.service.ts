import { programsRepository } from './programs.repository';
import { ApiError } from '../../common/errors/ApiError';
import { Program, ProgramStatus } from '../../database';
import { PROGRAM_MESSAGES } from './programs.constants';

interface CreateProgramData {
  name: string;
  code: string;
  description?: string;
  durationYears: number;
  entryRequirements?: string;
}

interface UpdateProgramData {
  name?: string;
  description?: string;
  durationYears?: number;
  entryRequirements?: string;
}

export const programsService = {
  async create(data: CreateProgramData): Promise<Program> {
    const exists = await programsRepository.existsByCode(data.code);
    if (exists) {
      throw ApiError.conflict(PROGRAM_MESSAGES.ALREADY_EXISTS);
    }
    return await programsRepository.create(data);
  },

  async getAll(status?: ProgramStatus): Promise<Program[]> {
    return await programsRepository.findAll(status);
  },

  async getById(id: string): Promise<Program> {
    const program = await programsRepository.findById(id);
    if (!program) {
      throw ApiError.notFound(PROGRAM_MESSAGES.NOT_FOUND);
    }
    return program;
  },

  async update(id: string, data: UpdateProgramData): Promise<Program> {
    const program = await programsRepository.findById(id);
    if (!program) {
      throw ApiError.notFound(PROGRAM_MESSAGES.NOT_FOUND);
    }
    const updated = await programsRepository.update(id, data);
    return updated!;
  },

  async activate(id: string): Promise<void> {
    const program = await programsRepository.findById(id);
    if (!program) {
      throw ApiError.notFound(PROGRAM_MESSAGES.NOT_FOUND);
    }
    if (program.status === ProgramStatus.ACTIVE) {
      throw ApiError.badRequest('Program is already active');
    }
    await programsRepository.update(id, { status: ProgramStatus.ACTIVE });
  },

  async deactivate(id: string): Promise<void> {
    const program = await programsRepository.findById(id);
    if (!program) {
      throw ApiError.notFound(PROGRAM_MESSAGES.NOT_FOUND);
    }
    if (program.status === ProgramStatus.INACTIVE) {
      throw ApiError.badRequest('Program is already inactive');
    }
    await programsRepository.update(id, { status: ProgramStatus.INACTIVE });
  },

  async delete(id: string): Promise<void> {
    const program = await programsRepository.findById(id);
    if (!program) {
      throw ApiError.notFound(PROGRAM_MESSAGES.NOT_FOUND);
    }
    await programsRepository.delete(id);
  },
};

export default programsService;