import { Request, Response, NextFunction } from 'express';
import { analyticsService } from './analytics.service';
import { successResponse } from '../../common/utils';

export const analyticsController = {
  async getDashboardStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await analyticsService.getDashboardStats();
      res.status(200).json(successResponse(stats));
    } catch (error) {
      next(error);
    }
  },

  async getProgramDistribution(_req: Request, res: Response, next: NextFunction) {
    try {
      const distribution = await analyticsService.getProgramDistribution();
      res.status(200).json(successResponse(distribution));
    } catch (error) {
      next(error);
    }
  }
};

export default analyticsController;
