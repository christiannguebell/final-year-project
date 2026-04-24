import { Request, Response, NextFunction } from 'express';
import { candidatesService } from './candidates.service';
import { successResponse } from '../../common/utils';
import { Gender } from '../../database';

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

export const candidatesController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const { dateOfBirth, gender, nationality, address, city, country } = req.body;
      const profile = await candidatesService.create({
        userId,
        dateOfBirth,
        gender: gender as Gender | undefined,
        nationality,
        address,
        city,
        country,
      });
      res.status(201).json(successResponse(profile, 'Candidate profile created'));
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const status = req.query.status as string;
      const programId = req.query.programId as string;
      const result = await candidatesService.list({ page, limit, search, status, programId });
      res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },

  async getMyProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const profile = await candidatesService.getByUserId(userId);
      res.status(200).json(successResponse(profile));
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params.id);
      const profile = await candidatesService.getById(id);
      res.status(200).json(successResponse(profile));
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const { dateOfBirth, gender, nationality, address, city, country, idType, idNumber, zipCode } = req.body;
      const upserted = await candidatesService.upsert(userId, {
        dateOfBirth,
        gender: gender as Gender | undefined,
        nationality,
        address,
        city,
        country,
        idType,
        idNumber,
        zipCode,
      });
      res.status(200).json(successResponse(upserted, 'Candidate profile saved'));
    } catch (error) {
      next(error);
    }
  },

  async updateProfilePhoto(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const profile = await candidatesService.getByUserId(userId);
      const photoPath = (req as any).file?.path;
      if (!photoPath) {
        throw new Error('No photo uploaded');
      }
      const updated = await candidatesService.updateProfilePhoto(profile.id, photoPath);
      res.status(200).json(successResponse(updated, 'Profile photo updated'));
    } catch (error) {
      next(error);
    }
  },
};

export default candidatesController;