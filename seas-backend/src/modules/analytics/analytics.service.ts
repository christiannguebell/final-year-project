import { AppDataSource, User, UserRole, UserStatus, Payment, PaymentStatus, Document, DocumentStatus, Application } from '../../database';

export const analyticsService = {
  async getDashboardStats() {
    const userRepository = AppDataSource.getRepository(User);
    const paymentRepository = AppDataSource.getRepository(Payment);
    const documentRepository = AppDataSource.getRepository(Document);

    const [totalApplicants, activeApplicants] = await Promise.all([
      userRepository.count({ where: { role: UserRole.CANDIDATE } }),
      userRepository.count({ where: { role: UserRole.CANDIDATE, status: UserStatus.ACTIVE } }),
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
    };
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
