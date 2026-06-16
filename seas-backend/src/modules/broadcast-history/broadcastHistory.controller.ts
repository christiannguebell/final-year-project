import { Request, Response, NextFunction } from 'express';
import { broadcastHistoryService } from './broadcastHistory.service';
import { successResponse } from '../../common/utils';
import { NotificationType, BroadcastChannel } from '../../database';

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

export const broadcastHistoryController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(getParam(req.query.page)) || 1;
      const limit = parseInt(getParam(req.query.limit)) || 20;
      const result = await broadcastHistoryService.getAll(page, limit);
      res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const record = await broadcastHistoryService.getById(id);
      res.status(200).json(successResponse(record));
    } catch (error) {
      next(error);
    }
  },

  async broadcast(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const sentBy = req.user?.userId || '';
      const { title, message, channel, type, templateId, templateData, link, userIds, filters } = req.body;
      const result = await broadcastHistoryService.broadcast({
        title,
        message,
        channel,
        type,
        templateId,
        templateData,
        link,
        userIds,
        filters,
        sentBy,
      });
      res.status(201).json(successResponse(result, 'Broadcast sent successfully'));
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      await broadcastHistoryService.delete(id);
      res.status(200).json(successResponse(null, 'Broadcast history deleted'));
    } catch (error) {
      next(error);
    }
  },
};
