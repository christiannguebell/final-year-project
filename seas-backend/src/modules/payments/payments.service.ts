import { paymentsRepository } from './payments.repository';
import { applicationsRepository } from '../applications/applications.repository';
import { ApiError } from '../../common/errors/ApiError';
import { Payment, PaymentStatus, UserRole } from '../../database';
import { PAYMENT_MESSAGES } from './payments.constants';
import { generatePaymentSummaryPdf } from '../exams/pdf.service';
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

  async getAll(options?: { page?: number; limit?: number; status?: PaymentStatus }) {
    return await paymentsRepository.findAll(options);
  },

  async getById(id: string, userId?: string, role?: string): Promise<Payment> {
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
    return payment;
  },

  async flag(id: string, notes?: string): Promise<Payment> {
    const payment = await paymentsRepository.findById(id);
    if (!payment) {
      throw ApiError.notFound(PAYMENT_MESSAGES.NOT_FOUND);
    }
    const updated = await paymentsRepository.updateNotes(id, notes || 'Flagged for manual review');
    return updated!;
  },

  async getMyPayments(userId: string): Promise<Payment[]> {
    const applications = await applicationsRepository.findByUserId(userId);
    if (applications.length === 0) return [];
    const payments = await Promise.all(
      applications.map((app) => paymentsRepository.findByApplicationId(app.id))
    );
    return payments.flat().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

  async getApplicationSummaryPdf(
    applicationId: string,
    userId?: string,
    role?: string
  ): Promise<Buffer> {
    const application = await applicationsRepository.findById(applicationId);
    if (!application) {
      throw ApiError.notFound('Application not found');
    }
    if (role !== UserRole.ADMIN && application.userId !== userId) {
      throw ApiError.forbidden(PAYMENT_MESSAGES.FORBIDDEN);
    }

    const payments = await paymentsRepository.findByApplicationId(applicationId);
    const invoiced = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const paid = payments
      .filter((payment) => payment.status === PaymentStatus.VERIFIED)
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    return generatePaymentSummaryPdf(application, payments, {
      invoiced,
      paid,
      balance: Math.max(invoiced - paid, 0),
    });
  },
};

export default paymentsService;