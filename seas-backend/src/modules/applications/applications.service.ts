import { applicationsRepository } from './applications.repository';
import { ApiError } from '../../common/errors/ApiError';
import { Application, ApplicationStatus, UserRole, Program } from '../../database';
import { AppDataSource } from '../../database';
import { APPLICATION_MESSAGES } from './applications.constants';

interface CreateApplicationData {
  userId: string;
  programId: string;
  personalStatement?: string;
}

interface UpdateApplicationData {
  programId?: string;
  personalStatement?: string;
}

export const applicationsService = {
  async create(data: CreateApplicationData): Promise<Application> {
    const exists = await applicationsRepository.existsByUserAndProgram(data.userId, data.programId);
    if (exists) {
      throw ApiError.conflict('Application for this program already exists');
    }
    return await applicationsRepository.create(data);
  },

  async getMyApplications(userId: string): Promise<Application[]> {
    return await applicationsRepository.findByUserId(userId);
  },

  async getById(id: string, userId?: string, role?: string): Promise<Application> {
    const application = await applicationsRepository.findById(id);
    if (!application) {
      throw ApiError.notFound(APPLICATION_MESSAGES.NOT_FOUND);
    }
    if (role !== UserRole.ADMIN && application.userId !== userId) {
      throw ApiError.forbidden(APPLICATION_MESSAGES.FORBIDDEN);
    }
    return application;
  },

  async update(id: string, userId: string, role: string, data: UpdateApplicationData): Promise<Application> {
    const application = await applicationsRepository.findById(id);
    if (!application) {
      throw ApiError.notFound(APPLICATION_MESSAGES.NOT_FOUND);
    }
    if (role !== UserRole.ADMIN && application.userId !== userId) {
      throw ApiError.forbidden(APPLICATION_MESSAGES.FORBIDDEN);
    }
    if (application.status !== ApplicationStatus.DRAFT) {
      throw ApiError.badRequest(APPLICATION_MESSAGES.CANNOT_EDIT);
    }
    const updated = await applicationsRepository.update(id, data);
    return updated!;
  },

  async submit(id: string, userId: string): Promise<Application> {
    const application = await applicationsRepository.findById(id);
    if (!application) {
      throw ApiError.notFound(APPLICATION_MESSAGES.NOT_FOUND);
    }
    if (application.userId !== userId) {
      throw ApiError.forbidden(APPLICATION_MESSAGES.FORBIDDEN);
    }
    if (application.status !== ApplicationStatus.DRAFT) {
      throw ApiError.badRequest(APPLICATION_MESSAGES.CANNOT_SUBMIT);
    }

    if (application.programId) {
      const program = await AppDataSource.getRepository(Program).findOne({
        where: { id: application.programId } as any,
      });
      if (program?.applicationDeadline) {
        const now = new Date();
        const deadline = new Date(program.applicationDeadline);
        if (now > deadline) {
          throw ApiError.badRequest('Application deadline has passed for this program');
        }
      }
    }

    const updated = await applicationsRepository.updateStatus(id, ApplicationStatus.SUBMITTED);
    return updated!;
  },

  async markUnderReview(id: string): Promise<Application> {
    const application = await applicationsRepository.findById(id);
    if (!application) {
      throw ApiError.notFound(APPLICATION_MESSAGES.NOT_FOUND);
    }
    if (application.status !== ApplicationStatus.SUBMITTED) {
      throw ApiError.badRequest('Can only mark submitted applications for review');
    }
    const updated = await applicationsRepository.updateStatus(id, ApplicationStatus.UNDER_REVIEW);
    return updated!;
  },

  async approve(id: string): Promise<Application> {
    const application = await applicationsRepository.findById(id);
    if (!application) {
      throw ApiError.notFound(APPLICATION_MESSAGES.NOT_FOUND);
    }
    if (application.status === ApplicationStatus.APPROVED) {
      throw ApiError.badRequest(APPLICATION_MESSAGES.ALREADY_APPROVED);
    }
    const updated = await applicationsRepository.updateStatus(id, ApplicationStatus.APPROVED);
    return updated!;
  },

  async reject(id: string): Promise<Application> {
    const application = await applicationsRepository.findById(id);
    if (!application) {
      throw ApiError.notFound(APPLICATION_MESSAGES.NOT_FOUND);
    }
    if (application.status === ApplicationStatus.REJECTED) {
      throw ApiError.badRequest(APPLICATION_MESSAGES.ALREADY_REJECTED);
    }
    const updated = await applicationsRepository.updateStatus(id, ApplicationStatus.REJECTED);
    return updated!;
  },

  async getAll(status?: ApplicationStatus): Promise<Application[]> {
    return await applicationsRepository.findAll(status);
  },

  async delete(id: string, userId: string): Promise<void> {
    const application = await applicationsRepository.findById(id);
    if (!application) {
      throw ApiError.notFound(APPLICATION_MESSAGES.NOT_FOUND);
    }
    if (application.userId !== userId) {
      throw ApiError.forbidden(APPLICATION_MESSAGES.FORBIDDEN);
    }
    if (application.status !== ApplicationStatus.DRAFT) {
      throw ApiError.badRequest('Cannot delete submitted application');
    }
    await applicationsRepository.delete(id);
  },
};

export default applicationsService;