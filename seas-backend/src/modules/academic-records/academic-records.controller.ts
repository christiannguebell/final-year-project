import { Request, Response, NextFunction } from 'express';
import { academicRecordsService } from './academic-records.service';

export const academicRecordsController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await academicRecordsService.create(req.body, (req as any).user.id, (req as any).user.role);
      res.status(201).json(record);
    } catch (error) {
      next(error);
    }
  },

  async getByApplicationId(req: Request, res: Response, next: NextFunction) {
    try {
      const applicationId = req.params.applicationId as string;
      const records = await academicRecordsService.getByApplicationId(applicationId, (req as any).user.id, (req as any).user.role);
      res.json(records);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const record = await academicRecordsService.getById(id, (req as any).user.id, (req as any).user.role);
      res.json(record);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const record = await academicRecordsService.update(id, req.body, (req as any).user.id, (req as any).user.role);
      res.json(record);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await academicRecordsService.delete(id, (req as any).user.id, (req as any).user.role);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
