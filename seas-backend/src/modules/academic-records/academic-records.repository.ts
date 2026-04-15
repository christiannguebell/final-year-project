import { AppDataSource } from '../../database';
import { AcademicRecord } from '../../database/entities/AcademicRecord';

export interface CreateAcademicRecordDto {
  applicationId: string;
  institution: string;
  degree: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
  fieldOfStudy?: string;
}

export interface UpdateAcademicRecordDto {
  institution?: string;
  degree?: string;
  startDate?: Date;
  endDate?: Date;
  grade?: string;
  fieldOfStudy?: string;
}

export const academicRecordsRepository = {
  async create(data: CreateAcademicRecordDto): Promise<AcademicRecord> {
    const repo = AppDataSource.getRepository(AcademicRecord);
    const record = repo.create(data as any);
    return await repo.save(record) as unknown as AcademicRecord;
  },

  async findById(id: string): Promise<AcademicRecord | null> {
    return AppDataSource.getRepository(AcademicRecord).findOne({
      where: { id } as any,
      relations: ['application'],
    });
  },

  async findByApplicationId(applicationId: string): Promise<AcademicRecord[]> {
    return AppDataSource.getRepository(AcademicRecord).find({
      where: { applicationId } as any,
    });
  },

  async update(id: string, data: UpdateAcademicRecordDto): Promise<AcademicRecord | null> {
    await AppDataSource.getRepository(AcademicRecord).update(id, data as any);
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await AppDataSource.getRepository(AcademicRecord).delete(id);
    return (result.affected ?? 0) > 0;
  },
};
