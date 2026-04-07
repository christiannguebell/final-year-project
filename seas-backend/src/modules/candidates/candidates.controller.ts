import { Request, Response, NextFunction } from 'express';
import { candidatesService } from './candidates.service';
import { successResponse } from '../../common/utils';
import { Gender } from '../../database';

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
      const profile = await candidatesService.getByUserId(userId);
      const { dateOfBirth, gender, nationality, address, city, country } = req.body;
      const updated = await candidatesService.update(profile.id, {
        dateOfBirth,
        gender: gender as Gender | undefined,
        nationality,
        address,
        city,
        country,
      });
      res.status(200).json(successResponse(updated, 'Candidate profile updated'));
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