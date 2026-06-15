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

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(String(req.query.page), 10) : undefined;
      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : undefined;
      const status = getParam(req.query.status) as PaymentStatus | undefined;
      const result = await paymentsService.getAll({ page, limit, status });
      res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const userId = req.user?.userId;
      const role = req.user?.role;
      const payment = await paymentsService.getById(id, userId, role);
      res.status(200).json(successResponse(payment));
    } catch (error) {
      next(error);
    }
  },

  async flag(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const { notes } = req.body;
      const payment = await paymentsService.flag(id, notes);
      res.status(200).json(successResponse(payment, 'Payment flagged for review'));
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

  async getApplicationSummary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const applicationId = getParam(req.params.applicationId);
      const userId = req.user?.userId;
      const role = req.user?.role;
      const pdfBuffer = await paymentsService.getApplicationSummaryPdf(applicationId, userId, role);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=payment-summary.pdf');
      res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  },
};

export default paymentsController;