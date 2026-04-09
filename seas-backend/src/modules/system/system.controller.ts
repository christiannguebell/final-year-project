import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../database';
import { ExamCenter } from '../../database';
import { Application, ApplicationStatus } from '../../database';
import { successResponse } from '../../common/utils';
import * as os from 'os';

export const systemController = {
  async getHealth(_req: Request, res: Response, next: NextFunction) {
    try {
      const isDbConnected = AppDataSource.isInitialized;
      let dbLatency = 0;
      
      if (isDbConnected) {
        const start = Date.now();
        await AppDataSource.query('SELECT 1');
        dbLatency = Date.now() - start;
      }

      const health = {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        systemInfo: {
          platform: os.platform(),
          memoryUsage: process.memoryUsage(),
          totalMem: os.totalmem(),
          freeMem: os.freemem(),
        },
        services: {
          database: {
            status: isDbConnected ? 'UP' : 'DOWN',
            latency: `${dbLatency}ms`,
          }
        }
      };

      const statusCode = isDbConnected ? 200 : 503;
      res.status(statusCode).json(successResponse(health, 'System health check'));
    } catch (error) {
      next(error);
    }
  },

  async getPublicStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const centerRepository = AppDataSource.getRepository(ExamCenter);
      const appRepository = AppDataSource.getRepository(Application);

      // Aggregating capacity sum
      const { totalCapacity } = await centerRepository
        .createQueryBuilder('center')
        .select('SUM(center.capacity)', 'totalCapacity')
        .where('center.is_active = :isActive', { isActive: true })
        .getRawOne() || { totalCapacity: 0 };

      const activeApplications = await appRepository.count({
        where: { status: ApplicationStatus.APPROVED }
      });

      const availableSeats = Math.max(0, parseInt(totalCapacity || '0', 10) - activeApplications);

      const stats = {
        totalSeatsAvailable: availableSeats,
        totalCapacity: parseInt(totalCapacity || '0', 10),
        activeCandidates: activeApplications,
      };

      res.status(200).json(successResponse(stats, 'Public statistics'));
    } catch (error) {
      next(error);
    }
  }
};

export default systemController;
