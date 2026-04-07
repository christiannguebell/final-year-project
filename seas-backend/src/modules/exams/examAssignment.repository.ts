import { AppDataSource } from '../../database';
import { ExamAssignment } from '../../database';

export interface CreateExamAssignmentDto {
  applicationId: string;
  sessionId: string;
  centerId: string;
  seatNumber: string;
  examTime?: Date;
}

export const examAssignmentsRepository = {
  async findById(id: string): Promise<ExamAssignment | null> {
    return AppDataSource.getRepository(ExamAssignment).findOne({
      where: { id } as any,
      relations: ['application', 'session', 'center'],
    });
  },

  async findByApplicationId(applicationId: string): Promise<ExamAssignment | null> {
    return AppDataSource.getRepository(ExamAssignment).findOne({
      where: { applicationId } as any,
      relations: ['session', 'center'],
    });
  },

  async findBySessionId(sessionId: string): Promise<ExamAssignment[]> {
    return AppDataSource.getRepository(ExamAssignment).find({
      where: { sessionId } as any,
      relations: ['application', 'center'],
    });
  },

  async findByCenterId(centerId: string): Promise<ExamAssignment[]> {
    return AppDataSource.getRepository(ExamAssignment).find({
      where: { centerId } as any,
    });
  },

  async create(data: CreateExamAssignmentDto): Promise<ExamAssignment> {
    const repo = AppDataSource.getRepository(ExamAssignment);
    const assignment = repo.create(data as any);
    return await repo.save(assignment) as unknown as ExamAssignment;
  },

  async createMany(data: CreateExamAssignmentDto[]): Promise<ExamAssignment[]> {
    const repo = AppDataSource.getRepository(ExamAssignment);
    const assignments = repo.create(data as any);
    return await repo.save(assignments) as unknown as ExamAssignment[];
  },

  async deleteBySessionId(sessionId: string): Promise<number> {
    const result = await AppDataSource.getRepository(ExamAssignment).delete({
      sessionId: sessionId as any,
    } as any);
    return result.affected || 0;
  },
};

export default examAssignmentsRepository;