import { Request, Response, NextFunction } from 'express';
import { resultsService } from './results.service';
import { successResponse } from '../../common/utils';
import { ResultStatus } from '../../database';

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

export const resultsController = {
  async createResult(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { applicationId } = req.body;
      const result = await resultsService.createResult({ applicationId });
      res.status(201).json(successResponse(result, 'Result created'));
    } catch (error) {
      next(error);
    }
  },

  async getResultById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const result = await resultsService.getResultById(id);
      res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },

  async getResultByApplication(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const applicationId = getParam(req.params.applicationId);
      const result = await resultsService.getResultByApplication(applicationId);
      res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },

  async getResultsBySession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const sessionId = getParam(req.params.sessionId);
      const results = await resultsService.getResultsBySession(sessionId);
      res.status(200).json(successResponse(results));
    } catch (error) {
      next(error);
    }
  },

  async getAllResults(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const status = getParam(req.query.status) as ResultStatus | undefined;
      const results = await resultsService.getAllResults(status);
      res.status(200).json(successResponse(results));
    } catch (error) {
      next(error);
    }
  },

  async enterScores(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { applicationId, scores } = req.body;
      const result = await resultsService.enterScores({ applicationId, scores });
      res.status(200).json(successResponse(result, 'Scores entered successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateResult(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const { totalScore, rank, status } = req.body;
      const result = await resultsService.updateResult(id, { totalScore, rank, status });
      res.status(200).json(successResponse(result, 'Result updated'));
    } catch (error) {
      next(error);
    }
  },

  async publishResult(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const result = await resultsService.publishResult(id);
      res.status(200).json(successResponse(result, 'Result published'));
    } catch (error) {
      next(error);
    }
  },

  async publishSessionResults(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const sessionId = getParam(req.params.sessionId);
      const result = await resultsService.publishSessionResults(sessionId);
      res.status(200).json(successResponse(result, 'Session results published'));
    } catch (error) {
      next(error);
    }
  },

  async deleteResult(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      await resultsService.deleteResult(id);
      res.status(200).json(successResponse(null, 'Result deleted'));
    } catch (error) {
      next(error);
    }
  },

  async getMyResult(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const result = await resultsService.getMyResult(userId);
      res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },
};

export default resultsController;