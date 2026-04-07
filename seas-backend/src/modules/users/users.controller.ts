import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service';
import { successResponse } from '../../common/utils';
import { UserStatus, UserRole } from '../../database';

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

export const usersController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(String(req.query.page)) : undefined;
      const limit = req.query.limit ? parseInt(String(req.query.limit)) : undefined;
      const search = getParam(req.query.search);
      const status = getParam(req.query.status) as UserStatus | undefined;
      const role = getParam(req.query.role) as UserRole | undefined;
      
      const result = await usersService.getAll({ page, limit, search, status, role });
      res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const user = await usersService.getById(id);
      res.status(200).json(successResponse(user));
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const { firstName, lastName, phone, status, role } = req.body;
      const user = await usersService.update(id, {
        firstName,
        lastName,
        phone,
        status,
        role,
      });
      res.status(200).json(successResponse(user, 'User updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      await usersService.activate(id);
      res.status(200).json(successResponse(null, 'User activated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      await usersService.deactivate(id);
      res.status(200).json(successResponse(null, 'User deactivated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      await usersService.delete(id);
      res.status(200).json(successResponse(null, 'User deleted successfully'));
    } catch (error) {
      next(error);
    }
  },
};

export default usersController;