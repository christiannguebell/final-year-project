import { Router } from 'express';
import { candidatesController } from './candidates.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { uploadLimiter } from '../../middlewares/security.middleware';
import { createCandidateSchema, updateCandidateSchema, idParamSchema } from './candidates.validation';

const router: Router = Router();

router.post(
  '/',
  authenticate,
  validate(createCandidateSchema),
  candidatesController.create
);

router.get(
  '/me',
  authenticate,
  candidatesController.getMyProfile
);

router.get(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  candidatesController.getById
);

router.put(
  '/',
  authenticate,
  validate(updateCandidateSchema),
  candidatesController.update
);

router.post(
  '/photo',
  authenticate,
  uploadLimiter,
  upload.single('photo'),
  candidatesController.updateProfilePhoto
);


export default router;