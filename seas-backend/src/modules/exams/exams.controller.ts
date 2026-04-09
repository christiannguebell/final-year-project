import { Request, Response, NextFunction } from 'express';
import { examsService } from './exams.service';
import { successResponse } from '../../common/utils';
import { ExamSessionStatus } from '../../database';

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

export const examsController = {
  async createSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, examDate, registrationStart, registrationEnd, description } = req.body;
      const session = await examsService.createSession({
        name,
        examDate: new Date(examDate),
        registrationStart: registrationStart ? new Date(registrationStart) : undefined,
        registrationEnd: registrationEnd ? new Date(registrationEnd) : undefined,
        description,
      });
      res.status(201).json(successResponse(session, 'Exam session created'));
    } catch (error) {
      next(error);
    }
  },

  async getSessions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const status = getParam(req.query.status) as ExamSessionStatus | undefined;
      const sessions = await examsService.getSessions(status);
      res.status(200).json(successResponse(sessions));
    } catch (error) {
      next(error);
    }
  },

  async getSessionById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const session = await examsService.getSessionById(id);
      res.status(200).json(successResponse(session));
    } catch (error) {
      next(error);
    }
  },

  async updateSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const { name, examDate, registrationStart, registrationEnd, description, status } = req.body;
      const session = await examsService.updateSession(id, {
        name,
        examDate: examDate ? new Date(examDate) : undefined,
        registrationStart: registrationStart ? new Date(registrationStart) : undefined,
        registrationEnd: registrationEnd ? new Date(registrationEnd) : undefined,
        description,
        status,
      });
      res.status(200).json(successResponse(session, 'Exam session updated'));
    } catch (error) {
      next(error);
    }
  },

  async deleteSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      await examsService.deleteSession(id);
      res.status(200).json(successResponse(null, 'Exam session deleted'));
    } catch (error) {
      next(error);
    }
  },

  async createCenter(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, address, city, capacity } = req.body;
      const center = await examsService.createCenter({ name, address, city, capacity });
      res.status(201).json(successResponse(center, 'Exam center created'));
    } catch (error) {
      next(error);
    }
  },

  async getCenters(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const activeOnly = req.query.active !== 'false';
      const centers = await examsService.getCenters(activeOnly);
      res.status(200).json(successResponse(centers));
    } catch (error) {
      next(error);
    }
  },

  async getCenterById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const center = await examsService.getCenterById(id);
      res.status(200).json(successResponse(center));
    } catch (error) {
      next(error);
    }
  },

  async updateCenter(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const { name, address, city, capacity, isActive } = req.body;
      const center = await examsService.updateCenter(id, { name, address, city, capacity, isActive });
      res.status(200).json(successResponse(center, 'Exam center updated'));
    } catch (error) {
      next(error);
    }
  },

  async deleteCenter(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      await examsService.deleteCenter(id);
      res.status(200).json(successResponse(null, 'Exam center deleted'));
    } catch (error) {
      next(error);
    }
  },

  async assignCandidates(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { sessionId, centerId } = req.body;
      const result = await examsService.assignCandidates({ sessionId, centerId });
      res.status(200).json(successResponse(result, 'Candidates assigned'));
    } catch (error) {
      next(error);
    }
  },

  async getMyAssignment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const assignment = await examsService.getMyAssignment(userId);
      res.status(200).json(successResponse(assignment));
    } catch (error) {
      next(error);
    }
  },
};

export default examsController;