import { jest, describe, it, expect, afterEach, beforeEach } from '@jest/globals';
import { notificationsService } from '../../../src/modules/notifications/notifications.service';
import { notificationsRepository } from '../../../src/modules/notifications/notifications.repository';
import { logAudit, auditLogger, AuditAction } from '../../../src/common/logger/audit';
import { auditMiddleware } from '../../../src/middlewares/audit.middleware';
import { emailService } from '../../../src/services/email.service';
import { AppDataSource, NotificationType, NotificationChannel} from '../../../src/database';

jest.mock('../../../src/modules/notifications/notifications.repository');
jest.mock('../../../src/database', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn(),
    }),
  },
  NotificationType: {
    SYSTEM: 'system',
    APPLICATION: 'application',
    PAYMENT: 'payment',
    EXAM: 'exam',
    RESULT: 'result',
  },
  NotificationChannel: {
    IN_APP: 'in_app',
    EMAIL: 'email',
  },
  User: {},
}));
jest.mock('../../../src/services/email.service', () => ({
  emailService: {
    sendTemplatedEmail: jest.fn(() => Promise.resolve()),
    sendMail: jest.fn(() => Promise.resolve()),
  },
}));
jest.mock('../../../src/services/email-template.service', () => ({
  emailTemplateService: {
    hasTemplate: jest.fn().mockReturnValue(true),
    render: jest.fn().mockReturnValue('<html></html>'),
  },
}));

describe('Communications & Audit - Feature #5', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Smart Broadcasting - Filter-based targeting', () => {
    it('should broadcast to users filtered by program id', async () => {
      (notificationsRepository.findUserIdsByFilters as any).mockResolvedValue([
        'user-1',
        'user-2',
        'user-3',
      ]);
      (notificationsRepository.createMany as any).mockResolvedValue(true);
      (AppDataSource.getRepository as any)().findOne.mockImplementation(() => ({
        mockResolvedValue: { id: '1', email: 'test@test.com', firstName: 'John' },
      }));

      const result = await notificationsService.broadcast({
        type: NotificationType.SYSTEM,
        title: 'Program Update',
        message: 'Important update for Robotics program',
        filters: {
          programId: 'program-robotics-uuid',
        },
      });

      expect(notificationsRepository.findUserIdsByFilters).toHaveBeenCalledWith({
        programId: 'program-robotics-uuid',
      });
      expect(result.sent).toBe(3);
    });

    it('should broadcast to users who have not paid', async () => {
      (notificationsRepository.findUserIdsByFilters as any).mockResolvedValue([
        'user-1',
        'user-2',
      ]);
      (notificationsRepository.createMany as any).mockResolvedValue(true);

      const result = await notificationsService.broadcast({
        type: NotificationType.PAYMENT,
        title: 'Payment Reminder',
        message: 'Please complete your payment',
        filters: {
          hasPaid: false,
          applicationStatus: 'submitted',
        },
      });

      expect(notificationsRepository.findUserIdsByFilters).toHaveBeenCalledWith({
        hasPaid: false,
        applicationStatus: 'submitted',
      });
      expect(result.sent).toBe(2);
    });

    it('should broadcast to users filtered by multiple criteria', async () => {
      (notificationsRepository.findUserIdsByFilters as any).mockResolvedValue(['user-1']);
      (notificationsRepository.createMany as any).mockResolvedValue(true);

      const result = await notificationsService.broadcast({
        type: NotificationType.EXAM,
        title: 'Exam Schedule',
        message: 'Your exam has been scheduled',
        filters: {
          programId: 'program-cs-uuid',
          applicationStatus: 'approved',
          paymentStatus: 'verified',
        },
      });

      expect(notificationsRepository.findUserIdsByFilters).toHaveBeenCalledWith({
        programId: 'program-cs-uuid',
        applicationStatus: 'approved',
        paymentStatus: 'verified',
      });
      expect(result.sent).toBe(1);
    });

    it('should send emails when channel is EMAIL', async () => {
      (notificationsRepository.findUserIdsByFilters as any).mockResolvedValue(['user-1']);
      (notificationsRepository.createMany as any).mockResolvedValue(true);
      (AppDataSource.getRepository as any)().findOne.mockResolvedValue({
        id: 'user-1',
        email: 'candidate@test.com',
        firstName: 'Candidate',
      });
      (emailService.sendMail as any).mockResolvedValue(true);

      const result = await notificationsService.broadcast({
        type: NotificationType.SYSTEM,
        channel: NotificationChannel.EMAIL,
        title: 'Important Announcement',
        message: 'Please check your dashboard',
        filters: {
          hasApplication: true,
        },
      });

      expect(result.emailsSent).toBe(1);
    });

    it('should handle empty user list gracefully', async () => {
      (notificationsRepository.findUserIdsByFilters as any).mockResolvedValue([]);

      const result = await notificationsService.broadcast({
        type: NotificationType.SYSTEM,
        filters: {
          programId: 'non-existent-program',
        },
      });

      expect(result.sent).toBe(0);
      expect(result.emailsSent).toBe(0);
    });

    it('should prioritize explicit userIds over filters', async () => {
      (notificationsRepository.createMany as any).mockResolvedValue(true);

      const result = await notificationsService.broadcast({
        type: NotificationType.SYSTEM,
        userIds: ['explicit-user-1', 'explicit-user-2'],
        filters: {
          hasPaid: false,
        },
      });

      expect(notificationsRepository.findUserIdsByFilters).not.toHaveBeenCalled();
      expect(result.sent).toBe(2);
    });
  });

  describe('Admin Audit Logs', () => {
    it('should log CREATE action', () => {
      const mockInfo = jest.spyOn(auditLogger, 'info').mockImplementation(() => auditLogger);

      logAudit(AuditAction.CREATE, 'admin-uuid', 'ADMIN', {
        targetType: 'Application',
        targetId: 'app-123',
        details: { field: 'updated' },
      });

      expect(mockInfo).toHaveBeenCalled();

      mockInfo.mockRestore();
    });

    it('should log UPDATE action', () => {
      const mockInfo = jest.spyOn(auditLogger, 'info').mockImplementation(() => auditLogger);

      logAudit(AuditAction.UPDATE, 'admin-uuid', 'ADMIN', {
        targetType: 'Result',
        targetId: 'result-456',
        details: { score: 95 },
      });

      expect(mockInfo).toHaveBeenCalled();

      mockInfo.mockRestore();
    });

    it('should log DELETE action', () => {
      const mockInfo = jest.spyOn(auditLogger, 'info').mockImplementation(() => auditLogger);

      logAudit(AuditAction.DELETE, 'admin-uuid', 'ADMIN', {
        targetType: 'Application',
        targetId: 'app-789',
      });

      expect(mockInfo).toHaveBeenCalled();

      mockInfo.mockRestore();
    });

    it('should log PUBLISH action for results', () => {
      const mockInfo = jest.spyOn(auditLogger, 'info').mockImplementation(() => auditLogger);

      logAudit(AuditAction.PUBLISH, 'admin-uuid', 'ADMIN', {
        targetType: 'Result',
        targetId: 'result-999',
        details: { sessionId: 'session-2024' },
      });

      expect(mockInfo).toHaveBeenCalled();

      mockInfo.mockRestore();
    });

    it('should log APPROVE action for applications', () => {
      const mockInfo = jest.spyOn(auditLogger, 'info').mockImplementation(() => auditLogger);

      logAudit(AuditAction.APPROVE, 'admin-uuid', 'ADMIN', {
        targetType: 'Application',
        targetId: 'app-approve-123',
      });

      expect(mockInfo).toHaveBeenCalled();

      mockInfo.mockRestore();
    });

    it('should log REJECT action for applications', () => {
      const mockInfo = jest.spyOn(auditLogger, 'info').mockImplementation(() => auditLogger);

      logAudit(AuditAction.REJECT, 'admin-uuid', 'ADMIN', {
        targetType: 'Application',
        targetId: 'app-reject-456',
      });

      expect(mockInfo).toHaveBeenCalled();

      mockInfo.mockRestore();
    });

    it('should log with IP address and user agent', () => {
      const mockInfo = jest.spyOn(auditLogger, 'info').mockImplementation(() => auditLogger);

      logAudit(AuditAction.LOGIN, 'user-uuid', 'CANDIDATE', {
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      });

      expect(mockInfo).toHaveBeenCalled();

      mockInfo.mockRestore();
    });
  });

  describe('Audit Middleware', () => {
    let mockReq: any;
    let mockRes: any;
    let mockNext: jest.Mock;

    beforeEach(() => {
      mockReq = {
        user: { userId: 'admin-123', role: 'ADMIN' },
        ip: '192.168.1.1',
        socket: { remoteAddress: undefined },
        get: jest.fn().mockReturnValue('Mozilla/5.0'),
        method: 'POST',
        params: { id: 'app-123' },
        path: '/api/applications/123/approve',
        query: {},
      };
      mockRes = {};
      mockNext = jest.fn();
    });

    it('should call next without logging if no user in request', async () => {
      mockReq.user = undefined;

      const middleware = auditMiddleware(AuditAction.APPROVE);
      await middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should log audit action with user info', async () => {
      const mockInfo = jest.spyOn(auditLogger, 'info').mockImplementation(() => auditLogger);

      const middleware = auditMiddleware(AuditAction.APPROVE);
      await middleware(mockReq, mockRes, mockNext);

      expect(mockInfo).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();

      mockInfo.mockRestore();
    });

    it('should log with action type from parameter', async () => {
      const mockInfo = jest.spyOn(auditLogger, 'info').mockImplementation(() => auditLogger);

      const middleware = auditMiddleware(AuditAction.PUBLISH);
      await middleware(mockReq, mockRes, mockNext);

      expect(mockInfo).toHaveBeenCalled();

      mockInfo.mockRestore();
    });
  });
});