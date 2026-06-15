import { applicationsRepository } from './applications.repository';
import { ApiError } from '../../common/errors/ApiError';
import { Application, ApplicationStatus, UserRole, Program, User, NotificationType, NotificationChannel } from '../../database';
import { AppDataSource } from '../../database';
import { APPLICATION_MESSAGES } from './applications.constants';
import { generateAdmissionLetterPdf } from '../exams/pdf.service';
import { notificationsRepository } from '../notifications/notifications.repository';
import { emailService } from '../../services/email.service';

interface CreateApplicationData {
  userId: string;
  programId: string;
  personalStatement?: string;
}

interface UpdateApplicationData {
  programId?: string;
  personalStatement?: string;
}

interface CounsellingRequestData {
  preferredDate: string;
  preferredTime: string;
  topic?: string;
}

const ADMISSIONS_EMAIL = process.env.ADMISSIONS_EMAIL || 'admissions@seas.cm';

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

  async getAdmissionLetterPdf(id: string, userId?: string, role?: string): Promise<Buffer> {
    const application = await applicationsRepository.findById(id);
    if (!application) {
      throw ApiError.notFound(APPLICATION_MESSAGES.NOT_FOUND);
    }
    if (role !== UserRole.ADMIN && application.userId !== userId) {
      throw ApiError.forbidden(APPLICATION_MESSAGES.FORBIDDEN);
    }
    if (application.status !== ApplicationStatus.APPROVED) {
      throw ApiError.badRequest('Admission letter is available only for approved applications');
    }

    return generateAdmissionLetterPdf(application);
  },

  async requestCounselling(userId: string, data: CounsellingRequestData) {
    const applications = await applicationsRepository.findByUserId(userId);
    if (applications.length === 0) {
      throw ApiError.badRequest('Submit an application before booking counselling');
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId } as any,
    });

    const latestApplication = applications[0];
    const topic = data.topic?.trim() || 'General admissions guidance';

    await notificationsRepository.create({
      userId,
      type: NotificationType.APPLICATION,
      channel: NotificationChannel.IN_APP,
      title: 'Counselling Request Received',
      message: `Your request for ${data.preferredDate} at ${data.preferredTime} has been sent to admissions. We will confirm your slot shortly.`,
      link: '/notifications',
    });

    try {
      await emailService.sendMail({
        to: ADMISSIONS_EMAIL,
        subject: 'Counselling Request - SEAS Candidate Portal',
        html: `
          <p><strong>New counselling request</strong></p>
          <p>Candidate: ${user?.firstName || ''} ${user?.lastName || ''} (${user?.email || 'unknown'})</p>
          <p>Application: ${latestApplication.id}</p>
          <p>Preferred date: ${data.preferredDate}</p>
          <p>Preferred time: ${data.preferredTime}</p>
          <p>Topic: ${topic}</p>
        `,
      });
    } catch {
      // Counselling is still recorded in-app if email delivery fails
    }

    return {
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      topic,
    };
  },
};

export default applicationsService;