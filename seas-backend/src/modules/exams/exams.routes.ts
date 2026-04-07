import { Router } from 'express';
import { examsController } from './exams.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { idParamSchema, createSessionSchema, updateSessionSchema, createCenterSchema, updateCenterSchema, assignCandidatesSchema } from './exams.validation';

const router: Router = Router();

router.post(
  '/sessions',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createSessionSchema),
  examsController.createSession
);

router.get(
  '/sessions',
  authenticate,
  examsController.getSessions
);

router.get(
  '/sessions/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  examsController.getSessionById
);

router.put(
  '/sessions/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  validate(updateSessionSchema),
  examsController.updateSession
);

router.delete(
  '/sessions/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  examsController.deleteSession
);

router.post(
  '/centers',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createCenterSchema),
  examsController.createCenter
);

router.get(
  '/centers',
  authenticate,
  examsController.getCenters
);

router.get(
  '/centers/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  examsController.getCenterById
);

router.put(
  '/centers/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  validate(updateCenterSchema),
  examsController.updateCenter
);

router.delete(
  '/centers/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  examsController.deleteCenter
);

router.post(
  '/assign',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(assignCandidatesSchema),
  examsController.assignCandidates
);

router.get(
  '/my-assignment',
  authenticate,
  examsController.getMyAssignment
);

export default router;