import { Request, Response, NextFunction } from 'express';
import { paymentsService } from './payments.service';
import { successResponse } from '../../common/utils';
import { PaymentStatus } from '../../database';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    tokenVersion: number;
  };
}

const getParam = (param: unknown): string => {
  if (typeof param === 'string') return param;
  if (Array.isArray(param)) return param[0];
  return '';
};

export const paymentsController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { applicationId, amount, paymentDate, method, transactionId } = req.body;
      console.log('Creating payment:', { applicationId, amount, paymentDate, method, transactionId });
      const payment = await paymentsService.create(applicationId, amount, new Date(paymentDate), method, transactionId);
      res.status(201).json(successResponse(payment, 'Payment recorded'));
    } catch (error) {
      next(error);
    }
  },

  async uploadReceipt(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const file = (req as any).file;
      const { transactionId, amount } = req.body;
      
      console.log('Uploading receipt for payment:', id, { transactionId, amount, file: file?.filename });

      if (!file) {
        throw new Error('No file uploaded');
      }
      
      const payment = await paymentsService.uploadReceipt(id, file, { 
        transactionId, 
        amount: amount ? Number(amount) : undefined 
      });
      res.status(200).json(successResponse(payment, 'Receipt uploaded'));
    } catch (error) {
      next(error);
    }
  },

  async getByApplication(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const applicationId = getParam(req.params.applicationId);
      const userId = req.user?.userId;
      const role = req.user?.role;
      
      const payments = await paymentsService.getByApplicationId(applicationId, userId, role);
      res.status(200).json(successResponse(payments));
    } catch (error) {
      next(error);
    }
  },

  async verify(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const { status, notes } = req.body;
      
      const payment = await paymentsService.verify(id, status as PaymentStatus, notes);
      res.status(200).json(successResponse(payment, `Payment ${status}`));
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const userId = req.user?.userId;
      const role = req.user?.role;
      
      await paymentsService.delete(id, userId, role);
      res.status(200).json(successResponse(null, 'Payment deleted'));
    } catch (error) {
      next(error);
    }
  },
};

export default paymentsController;