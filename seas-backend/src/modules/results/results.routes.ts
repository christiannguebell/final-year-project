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
} from './results.validation';

import { auditMiddleware } from '../../middlewares/audit.middleware';
import { AuditAction } from '../../common/logger/audit';


const router: Router = Router();

router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.CREATE),
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
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  validate(updateResultSchema),
  resultsController.updateResult
);


router.post(
  '/scores',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(enterScoresSchema),
  resultsController.enterScores
);


router.post(
  '/:id/publish',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.PUBLISH),
  validate(idParamSchema, 'params'),
  resultsController.publishResult
);


router.post(
  '/session/:sessionId/publish',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.PUBLISH),
  validate(sessionIdParamSchema, 'params'),
  resultsController.publishSessionResults
);


router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.DELETE),
  validate(idParamSchema, 'params'),
  resultsController.deleteResult
);


export default router;