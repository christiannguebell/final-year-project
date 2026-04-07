import { Router } from 'express';
import { resultsController } from './results.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import {
  idParamSchema,
  applicationIdParamSchema,
  sessionIdParamSchema,
  createResultSchema,
  enterScoresSchema,
  updateResultSchema,
  publishSessionSchema,
} from './results.validation';

const router: Router = Router();

router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createResultSchema),
  resultsController.createResult
);

router.get(
  '/',
  authenticate,
  resultsController.getAllResults
);

router.get(
  '/my-result',
  authenticate,
  resultsController.getMyResult
);

router.get(
  '/application/:applicationId',
  authenticate,
  validate(applicationIdParamSchema, 'params'),
  resultsController.getResultByApplication
);

router.get(
  '/session/:sessionId',
  authenticate,
  validate(sessionIdParamSchema, 'params'),
  resultsController.getResultsBySession
);

router.get(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  resultsController.getResultById
);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  validate(updateResultSchema),
  resultsController.updateResult
);

router.post(
  '/scores',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(enterScoresSchema),
  resultsController.enterScores
);

router.post(
  '/:id/publish',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  resultsController.publishResult
);

router.post(
  '/session/:sessionId/publish',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(sessionIdParamSchema, 'params'),
  resultsController.publishSessionResults
);

router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  resultsController.deleteResult
);

export default router;