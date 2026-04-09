import { paymentsService } from '../../../src/modules/payments/payments.service';
import { paymentsRepository } from '../../../src/modules/payments/payments.repository';
import { applicationsRepository } from '../../../src/modules/applications/applications.repository';
import { ApiError } from '../../../src/common/errors/ApiError';
import { PaymentStatus, UserRole } from '../../../src/database';
import fs from 'fs';

jest.mock('../../../src/modules/payments/payments.repository');
jest.mock('../../../src/modules/applications/applications.repository');
jest.mock('fs');

describe('PaymentsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw not found if application does not exist', async () => {
      (applicationsRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        paymentsService.create('app1', 100, new Date())
      ).rejects.toThrow(ApiError);
    });

    it('should create payment successfully', async () => {
      (applicationsRepository.findById as jest.Mock).mockResolvedValue({ id: 'app1' });
      (paymentsRepository.create as jest.Mock).mockResolvedValue({
        id: '1',
        applicationId: 'app1',
        amount: 100,
        status: PaymentStatus.PENDING,
      });

      const result = await paymentsService.create('app1', 100, new Date());

      expect(result.amount).toBe(100);
    });
  });

  describe('uploadReceipt', () => {
    it('should upload receipt successfully', async () => {
      (paymentsRepository.findById as jest.Mock).mockResolvedValue({ id: '1' });
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (paymentsRepository.updateReceipt as jest.Mock).mockResolvedValue({
        id: '1',
        receiptFile: '/uploads/receipts/test.jpg',
      });

      const mockFile = { path: '/uploads/receipts/test.jpg' } as Express.Multer.File;
      const result = await paymentsService.uploadReceipt('1', mockFile);

      expect(result.receiptFile).toBe('/uploads/receipts/test.jpg');
    });
  });

  describe('getByApplicationId', () => {
    it('should return payments for application', async () => {
      (applicationsRepository.findById as jest.Mock).mockResolvedValue({ id: 'app1', userId: '1' });
      (paymentsRepository.findByApplicationId as jest.Mock).mockResolvedValue([
        { id: '1', amount: 100 },
      ]);

      const result = await paymentsService.getByApplicationId('app1', '1', UserRole.CANDIDATE);

      expect(result).toHaveLength(1);
    });
  });

  describe('verify', () => {
    it('should verify payment', async () => {
      (paymentsRepository.findById as jest.Mock).mockResolvedValue({ id: '1' });
      (paymentsRepository.updateStatus as jest.Mock).mockResolvedValue({
        id: '1',
        status: PaymentStatus.VERIFIED,
      });

      const result = await paymentsService.verify('1', PaymentStatus.VERIFIED);

      expect(result.status).toBe(PaymentStatus.VERIFIED);
    });
  });

  describe('delete', () => {
    it('should delete payment and file', async () => {
      (paymentsRepository.findById as jest.Mock).mockResolvedValue({ 
        id: '1', 
        receiptFile: '/uploads/test.jpg' 
      });
      (applicationsRepository.findById as jest.Mock).mockResolvedValue({ id: 'app1', userId: '1' });
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (paymentsRepository.delete as jest.Mock).mockResolvedValue(true);

      await paymentsService.delete('1', '1', UserRole.CANDIDATE);

      expect(fs.unlinkSync).toHaveBeenCalled();
    });
  });
});