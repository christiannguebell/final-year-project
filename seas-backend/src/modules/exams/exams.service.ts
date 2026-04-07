import { examSessionsRepository } from './examSession.repository';
import { examCentersRepository } from './examCenter.repository';
import { examAssignmentsRepository } from './examAssignment.repository';
import { ApiError } from '../../common/errors/ApiError';
import { ExamSession, ExamSessionStatus } from '../../database';
import { Application, ApplicationStatus } from '../../database';
import { AppDataSource } from '../../database';
import { EXAM_MESSAGES } from './exams.constants';

interface CreateSessionData {
  name: string;
  examDate: Date;
  registrationStart?: Date;
  registrationEnd?: Date;
  description?: string;
}

interface CreateCenterData {
  name: string;
  address: string;
  city: string;
  capacity: number;
}

interface AssignCandidateData {
  sessionId: string;
  centerId: string;
}

export const examsService = {
  async createSession(data: CreateSessionData): Promise<ExamSession> {
    const exists = await examSessionsRepository.findByName(data.name);
    if (exists) {
      throw ApiError.conflict('Exam session with this name already exists');
    }
    return await examSessionsRepository.create(data);
  },

  async getSessions(status?: ExamSessionStatus): Promise<ExamSession[]> {
    return await examSessionsRepository.findAll(status);
  },

  async getSessionById(id: string): Promise<ExamSession> {
    const session = await examSessionsRepository.findById(id);
    if (!session) {
      throw ApiError.notFound(EXAM_MESSAGES.SESSION_NOT_FOUND);
    }
    return session;
  },

  async updateSession(id: string, data: Partial<ExamSession>): Promise<ExamSession> {
    const session = await examSessionsRepository.findById(id);
    if (!session) {
      throw ApiError.notFound(EXAM_MESSAGES.SESSION_NOT_FOUND);
    }
    const updated = await examSessionsRepository.update(id, data);
    return updated!;
  },

  async deleteSession(id: string): Promise<void> {
    const session = await examSessionsRepository.findById(id);
    if (!session) {
      throw ApiError.notFound(EXAM_MESSAGES.SESSION_NOT_FOUND);
    }
    await examAssignmentsRepository.deleteBySessionId(id);
    await examSessionsRepository.delete(id);
  },

  async createCenter(data: CreateCenterData): Promise<any> {
    const exists = await examCentersRepository.findByName(data.name);
    if (exists) {
      throw ApiError.conflict('Exam center with this name already exists');
    }
    return await examCentersRepository.create(data);
  },

  async getCenters(activeOnly = true): Promise<any[]> {
    return await examCentersRepository.findAll(activeOnly);
  },

  async getCenterById(id: string): Promise<any> {
    const center = await examCentersRepository.findById(id);
    if (!center) {
      throw ApiError.notFound(EXAM_MESSAGES.CENTER_NOT_FOUND);
    }
    return center;
  },

  async updateCenter(id: string, data: Partial<any>): Promise<any> {
    const center = await examCentersRepository.findById(id);
    if (!center) {
      throw ApiError.notFound(EXAM_MESSAGES.CENTER_NOT_FOUND);
    }
    const updated = await examCentersRepository.update(id, data);
    return updated!;
  },

  async deleteCenter(id: string): Promise<void> {
    const center = await examCentersRepository.findById(id);
    if (!center) {
      throw ApiError.notFound(EXAM_MESSAGES.CENTER_NOT_FOUND);
    }
    await examCentersRepository.delete(id);
  },

  async assignCandidates(data: AssignCandidateData): Promise<any> {
    const session = await examSessionsRepository.findById(data.sessionId);
    if (!session) {
      throw ApiError.notFound(EXAM_MESSAGES.SESSION_NOT_FOUND);
    }

    const center = await examCentersRepository.findById(data.centerId);
    if (!center) {
      throw ApiError.notFound(EXAM_MESSAGES.CENTER_NOT_FOUND);
    }

    const approvedApplications = await AppDataSource.getRepository(Application).find({
      where: { status: ApplicationStatus.APPROVED } as any,
    });

    if (approvedApplications.length === 0) {
      throw ApiError.badRequest('No approved applications to assign');
    }

    const existingAssignments = await examAssignmentsRepository.findBySessionId(data.sessionId);
    const existingApplicationIds = new Set(existingAssignments.map(a => a.applicationId));

    const candidatesToAssign = approvedApplications.filter(
      app => !existingApplicationIds.has(app.id)
    );

    if (candidatesToAssign.length > center.capacity) {
      throw ApiError.badRequest(`Center capacity exceeded. Maximum: ${center.capacity}`);
    }

    const assignments = candidatesToAssign.map((app, index) => ({
      applicationId: app.id,
      sessionId: data.sessionId,
      centerId: data.centerId,
      seatNumber: `S${String(index + 1).padStart(3, '0')}`,
      examTime: session.examDate,
    }));

    if (assignments.length > 0) {
      await examAssignmentsRepository.createMany(assignments);
    }

    return { assigned: assignments.length, message: 'Candidates assigned successfully' };
  },

  async getMyAssignment(userId: string): Promise<any> {
    const applications = await AppDataSource.getRepository(Application).find({
      where: { userId } as any,
    });

    if (applications.length === 0) {
      throw ApiError.notFound(EXAM_MESSAGES.NO_ASSIGNMENT);
    }

    for (const app of applications) {
      const assignment = await examAssignmentsRepository.findByApplicationId(app.id);
      if (assignment) {
        return assignment;
      }
    }

    throw ApiError.notFound(EXAM_MESSAGES.NO_ASSIGNMENT);
  },
};

export default examsService;