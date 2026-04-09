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

/**
 * @openapi
 * /api/results:
 *   post:
 *     tags:
 *       - Results
 *     summary: Create result record (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicationId
 *             properties:
 *               applicationId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Result record created
 */
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.CREATE),
  validate(createResultSchema),
  resultsController.createResult
);

/**
 * @openapi
 * /api/results:
 *   get:
 *     tags:
 *       - Results
 *     summary: List all results
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of results
 */
router.get(
  '/',
  authenticate,
  resultsController.getAllResults
);

/**
 * @openapi
 * /api/results/my-result:
 *   get:
 *     tags:
 *       - Results
 *     summary: Get current candidate's result
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Result details
 */
router.get(
  '/my-result',
  authenticate,
  resultsController.getMyResult
);

/**
 * @openapi
 * /api/results/application/{applicationId}:
 *   get:
 *     tags:
 *       - Results
 *     summary: Get result by application ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Result details
 */
router.get(
  '/application/:applicationId',
  authenticate,
  validate(applicationIdParamSchema, 'params'),
  resultsController.getResultByApplication
);

/**
 * @openapi
 * /api/results/session/{sessionId}:
 *   get:
 *     tags:
 *       - Results
 *     summary: Get results by session ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of results
 */
router.get(
  '/session/:sessionId',
  authenticate,
  validate(sessionIdParamSchema, 'params'),
  resultsController.getResultsBySession
);

/**
 * @openapi
 * /api/results/{id}:
 *   get:
 *     tags:
 *       - Results
 *     summary: Get result by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Result details
 */
router.get(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  resultsController.getResultById
);

/**
 * @openapi
 * /api/results/{id}:
 *   put:
 *     tags:
 *       - Results
 *     summary: Update result (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalScore:
 *                 type: number
 *     responses:
 *       200:
 *         description: Result updated
 */
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  validate(updateResultSchema),
  resultsController.updateResult
);

/**
 * @openapi
 * /api/results/scores:
 *   post:
 *     tags:
 *       - Results
 *     summary: Enter subject scores (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resultId
 *               - scores
 *             properties:
 *               resultId:
 *                 type: string
 *               scores:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     subject:
 *                       type: string
 *                     score:
 *                       type: number
 *     responses:
 *       200:
 *         description: Scores updated
 */
router.post(
  '/scores',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(enterScoresSchema),
  resultsController.enterScores
);

/**
 * @openapi
 * /api/results/{id}/publish:
 *   post:
 *     tags:
 *       - Results
 *     summary: Publish a single result (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Result published
 */
router.post(
  '/:id/publish',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.PUBLISH),
  validate(idParamSchema, 'params'),
  resultsController.publishResult
);

/**
 * @openapi
 * /api/results/session/{sessionId}/publish:
 *   post:
 *     tags:
 *       - Results
 *     summary: Publish all results for a session (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Results published
 */
router.post(
  '/session/:sessionId/publish',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.PUBLISH),
  validate(sessionIdParamSchema, 'params'),
  resultsController.publishSessionResults
);

/**
 * @openapi
 * /api/results/{id}:
 *   delete:
 *     tags:
 *       - Results
 *     summary: Delete result record (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Result deleted
 */
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.DELETE),
  validate(idParamSchema, 'params'),
  resultsController.deleteResult
);


export default router;