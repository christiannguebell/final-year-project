import {
  AppDataSource,
  User,
  UserRole,
  UserStatus,
  Payment,
  PaymentStatus,
  Document,
  DocumentStatus,
  Application,
  ApplicationStatus,
  Program,
} from '../../database';

export const analyticsService = {
  async getDashboardStats() {
    const userRepository = AppDataSource.getRepository(User);
    const paymentRepository = AppDataSource.getRepository(Payment);
    const documentRepository = AppDataSource.getRepository(Document);
    const applicationRepository = AppDataSource.getRepository(Application);
    const programRepository = AppDataSource.getRepository(Program);

    const [
      totalApplicants,
      activeApplicants,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalPrograms,
    ] = await Promise.all([
      userRepository.count({ where: { role: UserRole.CANDIDATE } }),
      userRepository.count({ where: { role: UserRole.CANDIDATE, status: UserStatus.ACTIVE } }),
      applicationRepository.count(),
      applicationRepository.count({ where: { status: ApplicationStatus.UNDER_REVIEW } }),
      applicationRepository.count({ where: { status: ApplicationStatus.APPROVED } }),
      applicationRepository.count({ where: { status: ApplicationStatus.REJECTED } }),
      programRepository.count(),
    ]);

    const { sum: revenueString } = await paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'sum')
      .where('payment.status = :status', { status: PaymentStatus.VERIFIED })
      .getRawOne() || { sum: 0 };
    
    const totalRevenue = parseFloat(revenueString || '0');

    const [totalDocs, verifiedDocs] = await Promise.all([
      documentRepository.count(),
      documentRepository.count({ where: { status: DocumentStatus.VERIFIED } })
    ]);

    const documentVerificationProgress = totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 0;

    return {
      totalApplicants,
      activeApplicants,
      totalRevenue,
      documentVerificationProgress,
      totalCandidates: totalApplicants,
      totalApplications,
      totalPrograms,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
    };
  },

  async getApplicationsByStatus() {
    const applicationRepository = AppDataSource.getRepository(Application);
    const statuses = Object.values(ApplicationStatus);

    return Promise.all(
      statuses.map(async (status) => ({
        status,
        count: await applicationRepository.count({ where: { status } }),
      }))
    );
  },

  async getApplicationsOverTime() {
    const applicationRepository = AppDataSource.getRepository(Application);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const rows = await applicationRepository
      .createQueryBuilder('application')
      .select("TO_CHAR(application.created_at, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(application.id)', 'count')
      .where('application.created_at >= :start', { start: thirtyDaysAgo })
      .groupBy("TO_CHAR(application.created_at, 'YYYY-MM-DD')")
      .orderBy('date', 'ASC')
      .getRawMany();

    return rows.map((row) => ({
      date: row.date,
      count: parseInt(row.count, 10),
    }));
  },

  async getProgramDistribution() {
    const applicationRepository = AppDataSource.getRepository(Application);
    
    const distribution = await applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.program', 'program')
      .select('program.id', 'programId')
      .addSelect('program.name', 'programName')
      .addSelect('COUNT(application.id)', 'applicationCount')
      .groupBy('program.id')
      .getRawMany();

    return distribution.map(d => ({
      programId: d.programId,
      programName: d.programName,
      count: parseInt(d.applicationCount, 10),
    }));
  }
};

export default analyticsService;
