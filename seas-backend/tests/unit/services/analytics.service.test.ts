import { analyticsService } from '../../../src/modules/analytics/analytics.service';
import { AppDataSource } from '../../../src/database';
import { UserRole, UserStatus, PaymentStatus, DocumentStatus } from '../../../src/database';

jest.mock('../../../src/database', () => {
  const originalModule = jest.requireActual('../../../src/database');
  return {
    ...originalModule,
    AppDataSource: {
      getRepository: jest.fn(),
    },
  };
});

describe('AnalyticsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('should aggregate and return dashboard statistics correctly', async () => {
      // Mock repositories
      const mockUserRepository = {
        count: jest.fn(),
      };
      
      const mockPaymentRepository = {
        createQueryBuilder: jest.fn(),
      };
      
      const mockDocumentRepository = {
        count: jest.fn(),
      };

      // Set up the getRepository mock implementation based on the queried entity
      (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
        if (entity.name === 'User') return mockUserRepository;
        if (entity.name === 'Payment') return mockPaymentRepository;
        if (entity.name === 'Document') return mockDocumentRepository;
        return {};
      });

      // Mock user counts
      mockUserRepository.count.mockImplementation(async (query: any) => {
        if (query.where.status === UserStatus.ACTIVE) {
          return 150; // Active applicants
        }
        return 200; // Total applicants
      });

      // Mock payment revenue
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ sum: '50000.50' }),
      };
      mockPaymentRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      // Mock document counts
      mockDocumentRepository.count.mockImplementation(async (query?: any) => {
        if (query?.where?.status === DocumentStatus.VERIFIED) {
          return 80; // Verified docs
        }
        return 100; // Total docs
      });

      const result = await analyticsService.getDashboardStats();

      // Assertions
      expect(result.totalApplicants).toBe(200);
      expect(result.activeApplicants).toBe(150);
      expect(result.totalRevenue).toBe(50000.5);
      expect(result.documentVerificationProgress).toBe(80); // 80 / 100 * 100

      // Verify correct query parameters were used
      expect(mockUserRepository.count).toHaveBeenCalledWith({ where: { role: UserRole.CANDIDATE } });
      expect(mockUserRepository.count).toHaveBeenCalledWith({ where: { role: UserRole.CANDIDATE, status: UserStatus.ACTIVE } });
      
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('payment.status = :status', { status: PaymentStatus.VERIFIED });
      
      expect(mockDocumentRepository.count).toHaveBeenCalledWith();
      expect(mockDocumentRepository.count).toHaveBeenCalledWith({ where: { status: DocumentStatus.VERIFIED } });
    });

    it('should handle zero documents gracefully (prevent division by zero)', async () => {
      (AppDataSource.getRepository as jest.Mock).mockImplementation(() => ({
        count: jest.fn().mockResolvedValue(0),
        createQueryBuilder: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getRawOne: jest.fn().mockResolvedValue({ sum: null }),
        })
      }));

      const result = await analyticsService.getDashboardStats();

      expect(result.documentVerificationProgress).toBe(0);
      expect(result.totalRevenue).toBe(0);
    });
  });

  describe('getProgramDistribution', () => {
    it('should correctly format query results for program distribution', async () => {
      const mockApplicationRepository = {
        createQueryBuilder: jest.fn(),
      };

      (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
        if (entity.name === 'Application') return mockApplicationRepository;
        return {};
      });

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { programId: '1', programName: 'Computer Science', applicationCount: '45' },
          { programId: '2', programName: 'Robotics', applicationCount: '20' }
        ]),
      };
      mockApplicationRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await analyticsService.getProgramDistribution();

      expect(result).toEqual([
        { programId: '1', programName: 'Computer Science', count: 45 },
        { programId: '2', programName: 'Robotics', count: 20 }
      ]);
    });
  });
});
