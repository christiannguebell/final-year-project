import { Request, Response, NextFunction } from 'express';
import { applicationsService } from './applications.service';
import { successResponse } from '../../common/utils';
import { ApplicationStatus } from '../../database';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

const getParam = (param: unknown): string => {
  if (typeof param === 'string') return param;
  if (Array.isArray(param)) return param[0];
  return '';
};

export const applicationsController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const { programId, personalStatement } = req.body;
      const application = await applicationsService.create({
        userId,
        programId,
        personalStatement,
      });
      res.status(201).json(successResponse(application, 'Application created'));
    } catch (error) {
      next(error);
    }
  },

  async getMyApplications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const applications = await applicationsService.getMyApplications(userId);
      res.status(200).json(successResponse(applications));
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const userId = req.user?.userId;
      const role = req.user?.role || '';
      const application = await applicationsService.getById(id, userId, role);
      res.status(200).json(successResponse(application));
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const userId = req.user?.userId;
      const role = req.user?.role || '';
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const { programId, personalStatement } = req.body;
      const application = await applicationsService.update(id, userId, role, {
        programId,
        personalStatement,
      });
      res.status(200).json(successResponse(application, 'Application updated'));
    } catch (error) {
      next(error);
    }
  },

  async submit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const application = await applicationsService.submit(id, userId);
      res.status(200).json(successResponse(application, 'Application submitted'));
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const status = getParam(req.query.status) as ApplicationStatus | undefined;
      const applications = await applicationsService.getAll(status);
      res.status(200).json(successResponse(applications));
    } catch (error) {
      next(error);
    }
  },

  async approve(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const application = await applicationsService.approve(id);
      res.status(200).json(successResponse(application, 'Application approved'));
    } catch (error) {
      next(error);
    }
  },

  async reject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const application = await applicationsService.reject(id);
      res.status(200).json(successResponse(application, 'Application rejected'));
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      await applicationsService.delete(id, userId);
      res.status(200).json(successResponse(null, 'Application deleted'));
    } catch (error) {
      next(error);
    }
  },
};

export default applicationsController;