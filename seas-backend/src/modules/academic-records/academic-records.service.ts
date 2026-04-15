import { academicRecordsRepository, CreateAcademicRecordDto, UpdateAcademicRecordDto } from './academic-records.repository';
import { ApiError } from '../../common/errors/ApiError';
import { ACADEMIC_RECORD_MESSAGES } from './academic-records.constants';
import { AcademicRecord, UserRole } from '../../database';
import { applicationsRepository } from '../applications/applications.repository';

export const academicRecordsService = {
  async create(data: CreateAcademicRecordDto, userId: string, role?: string): Promise<AcademicRecord> {
    const application = await applicationsRepository.findById(data.applicationId);
    if (!application) {
      throw ApiError.notFound('Application not found');
    }

    if (role !== UserRole.ADMIN && application.userId !== userId) {
      throw ApiError.forbidden(ACADEMIC_RECORD_MESSAGES.FORBIDDEN);
    }

    return await academicRecordsRepository.create(data);
  },

  async getByApplicationId(applicationId: string, userId: string, role?: string): Promise<AcademicRecord[]> {
    const application = await applicationsRepository.findById(applicationId);
    if (!application) {
      throw ApiError.notFound('Application not found');
    }

    if (role !== UserRole.ADMIN && application.userId !== userId) {
      throw ApiError.forbidden(ACADEMIC_RECORD_MESSAGES.FORBIDDEN);
    }

    return await academicRecordsRepository.findByApplicationId(applicationId);
  },

  async getById(id: string, userId: string, role?: string): Promise<AcademicRecord> {
    const record = await academicRecordsRepository.findById(id);
    if (!record) {
      throw ApiError.notFound(ACADEMIC_RECORD_MESSAGES.NOT_FOUND);
    }

    const application = await applicationsRepository.findById(record.applicationId);
    if (role !== UserRole.ADMIN && application?.userId !== userId) {
      throw ApiError.forbidden(ACADEMIC_RECORD_MESSAGES.FORBIDDEN);
    }

    return record;
  },

  async update(id: string, data: UpdateAcademicRecordDto, userId: string, role?: string): Promise<AcademicRecord> {
    await this.getById(id, userId, role);
    const updated = await academicRecordsRepository.update(id, data);
    return updated!;
  },

  async delete(id: string, userId: string, role?: string): Promise<void> {
    await this.getById(id, userId, role);
    await academicRecordsRepository.delete(id);
  },
};
