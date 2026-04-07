import { AppDataSource } from '../../database';
import { Payment, PaymentStatus } from '../../database';

export interface CreatePaymentDto {
  applicationId: string;
  amount: number;
  paymentDate: Date;
  receiptFile?: string;
}

export const paymentsRepository = {
  async findById(id: string): Promise<Payment | null> {
    return AppDataSource.getRepository(Payment).findOne({
      where: { id } as any,
      relations: ['application'],
    });
  },

  async findByApplicationId(applicationId: string): Promise<Payment[]> {
    return AppDataSource.getRepository(Payment).find({
      where: { applicationId } as any,
      order: { paymentDate: 'DESC' },
    });
  },

  async create(data: CreatePaymentDto): Promise<Payment> {
    const repo = AppDataSource.getRepository(Payment);
    const payment = repo.create({
      ...data,
      status: PaymentStatus.PENDING,
    } as any);
    return await repo.save(payment) as unknown as Payment;
  },

  async updateStatus(id: string, status: PaymentStatus, notes?: string): Promise<Payment | null> {
    await AppDataSource.getRepository(Payment).update(id, {
      status,
      notes,
    } as any);
    return this.findById(id);
  },

  async updateReceipt(id: string, receiptFile: string): Promise<Payment | null> {
    await AppDataSource.getRepository(Payment).update(id, {
      receiptFile,
      status: PaymentStatus.PENDING,
    } as any);
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await AppDataSource.getRepository(Payment).delete(id);
    return (result.affected ?? 0) > 0;
  },
};

export default paymentsRepository;