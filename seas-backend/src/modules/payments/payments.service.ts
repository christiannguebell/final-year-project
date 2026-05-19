import { paymentsRepository } from './payments.repository';
import { applicationsRepository } from '../applications/applications.repository';
import { ApiError } from '../../common/errors/ApiError';
import { Payment, PaymentStatus, UserRole } from '../../database';
import { PAYMENT_MESSAGES } from './payments.constants';
import fs from 'fs';

const UPLOAD_DIR = 'uploads/receipts';

export const paymentsService = {
  async create(applicationId: string, amount: number, paymentDate: Date, method: 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CASH', transactionId?: string, receiptFile?: string): Promise<Payment> {
    const application = await applicationsRepository.findById(applicationId);
    if (!application) {
      throw ApiError.notFound('Application not found');
    }
    return await paymentsRepository.create({
      applicationId,
      amount,
      paymentDate,
      method,
      transactionId,
      receiptFile,
    });
  },

  async uploadReceipt(id: string, file: Express.Multer.File, data: { transactionId?: string; amount?: number }): Promise<Payment> {
    const payment = await paymentsRepository.findById(id);
    if (!payment) {
      throw ApiError.notFound(PAYMENT_MESSAGES.NOT_FOUND);
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const updated = await paymentsRepository.updateReceipt(id, {
      receiptFile: file.path,
      ...data,
    });
    return updated!;
  },

  async getByApplicationId(applicationId: string, userId?: string, role?: string): Promise<Payment[]> {
    const application = await applicationsRepository.findById(applicationId);
    if (!application) {
      throw ApiError.notFound('Application not found');
    }
    if (role !== UserRole.ADMIN && application.userId !== userId) {
      throw ApiError.forbidden(PAYMENT_MESSAGES.FORBIDDEN);
    }
    return await paymentsRepository.findByApplicationId(applicationId);
  },

  async verify(id: string, status: PaymentStatus, notes?: string): Promise<Payment> {
    const payment = await paymentsRepository.findById(id);
    if (!payment) {
      throw ApiError.notFound(PAYMENT_MESSAGES.NOT_FOUND);
    }
    const updated = await paymentsRepository.updateStatus(id, status, notes);
    return updated!;
  },

  async delete(id: string, userId?: string, role?: string): Promise<void> {
    const payment = await paymentsRepository.findById(id);
    if (!payment) {
      throw ApiError.notFound(PAYMENT_MESSAGES.NOT_FOUND);
    }
    const application = await applicationsRepository.findById(payment.applicationId);
    if (!application) {
      throw ApiError.notFound('Application not found');
    }
    if (role !== UserRole.ADMIN && application.userId !== userId) {
      throw ApiError.forbidden(PAYMENT_MESSAGES.FORBIDDEN);
    }
    if (payment.receiptFile && fs.existsSync(payment.receiptFile)) {
      fs.unlinkSync(payment.receiptFile);
    }
    await paymentsRepository.delete(id);
  },
};

export default paymentsService;