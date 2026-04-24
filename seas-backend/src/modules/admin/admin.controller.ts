import { Request, Response, NextFunction } from 'express';
import { adminService } from './admin.service';
import { successResponse } from '../../common/utils';
import { UserRole } from '../../database';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    tokenVersion: number;
  };
}

export const adminController = {
  async createAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, role } = req.body;
      const result = await adminService.createAdmin(email, role as UserRole);
      res.status(201).json(successResponse(result, 'Admin created successfully'));
    } catch (error) {
      next(error);
    }
  },

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, otp } = req.body;
      const result = await adminService.verifyOtp(userId, otp);
      res.status(200).json(successResponse(result, 'OTP verified successfully'));
    } catch (error) {
      next(error);
    }
  },

  async setupPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, password } = req.body;
      const result = await adminService.setupPassword(userId, password);
      res.status(200).json(successResponse(result, 'Password set successfully'));
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await adminService.login(email, password);
      res.status(200).json(successResponse(result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = await adminService.refreshToken(refreshToken);
      res.status(200).json(successResponse(tokens, 'Token refreshed'));
    } catch (error) {
      next(error);
    }
  },

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await adminService.resendOtp(email);
      res.status(200).json(successResponse(result, 'OTP sent successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getAdmins(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const admins = await adminService.getAdmins();
      res.status(200).json(successResponse(admins));
    } catch (error) {
      next(error);
    }
  },

  async getAdminById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const admin = await adminService.getAdminById(id);
      res.status(200).json(successResponse(admin));
    } catch (error) {
      next(error);
    }
  },

  async deleteAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await adminService.deleteAdmin(id);
      res.status(200).json(successResponse(null, 'Admin deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await adminService.forgotPassword(email);
      res.status(200).json(successResponse(null, 'If the email exists, a reset link has been sent'));
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      await adminService.resetPassword(token, newPassword);
      res.status(200).json(successResponse(null, 'Password reset successfully'));
    } catch (error) {
      next(error);
    }
  },
};

export default adminController;