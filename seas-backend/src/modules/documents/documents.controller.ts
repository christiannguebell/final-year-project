import { Request, Response, NextFunction } from 'express';
import { documentsService } from './documents.service';
import { successResponse } from '../../common/utils';
import { DocumentType, DocumentStatus } from '../../database';

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

export const documentsController = {
  async upload(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const applicationId = getParam(req.body.applicationId);
      const type = req.body.type as DocumentType;
      const file = (req as any).file;
      
      if (!file) {
        throw new Error('No file uploaded');
      }
      
      const doc = await documentsService.upload(applicationId, type, file);
      res.status(201).json(successResponse(doc, 'Document uploaded'));
    } catch (error) {
      next(error);
    }
  },

  async getByApplication(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const applicationId = getParam(req.params.applicationId);
      const userId = req.user?.userId;
      const role = req.user?.role;
      
      const docs = await documentsService.getByApplicationId(applicationId, userId, role);
      res.status(200).json(successResponse(docs));
    } catch (error) {
      next(error);
    }
  },

  async verify(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const { status, notes } = req.body;
      
      const doc = await documentsService.verify(id, status as DocumentStatus, notes);
      res.status(200).json(successResponse(doc, `Document ${status}`));
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const userId = req.user?.userId;
      const role = req.user?.role;
      
      await documentsService.delete(id, userId, role);
      res.status(200).json(successResponse(null, 'Document deleted'));
    } catch (error) {
      next(error);
    }
  },
};

export default documentsController;