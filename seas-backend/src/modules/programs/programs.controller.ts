import { Request, Response, NextFunction } from 'express';
import { programsService } from './programs.service';
import { successResponse } from '../../common/utils';
import { ProgramStatus } from '../../database';

const getParam = (param: unknown): string => {
  if (typeof param === 'string') return param;
  if (Array.isArray(param)) return param[0];
  return '';
};

export const programsController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, code, description, durationYears, entryRequirements } = req.body;
      const program = await programsService.create({
        name,
        code,
        description,
        durationYears,
        entryRequirements,
      });
      res.status(201).json(successResponse(program, 'Program created successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const status = getParam(req.query.status) as ProgramStatus | undefined;
      const programs = await programsService.getAll(status);
      res.status(200).json(successResponse(programs));
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const program = await programsService.getById(id);
      res.status(200).json(successResponse(program));
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const { name, description, durationYears, entryRequirements } = req.body;
      const program = await programsService.update(id, {
        name,
        description,
        durationYears,
        entryRequirements,
      });
      res.status(200).json(successResponse(program, 'Program updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      await programsService.activate(id);
      res.status(200).json(successResponse(null, 'Program activated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      await programsService.deactivate(id);
      res.status(200).json(successResponse(null, 'Program deactivated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      await programsService.delete(id);
      res.status(200).json(successResponse(null, 'Program deleted successfully'));
    } catch (error) {
      next(error);
    }
  },
};

export default programsController;