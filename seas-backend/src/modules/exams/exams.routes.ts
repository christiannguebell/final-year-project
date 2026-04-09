import { Router } from 'express';
import { examsController } from './exams.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { idParamSchema, createSessionSchema, updateSessionSchema, createCenterSchema, updateCenterSchema, assignCandidatesSchema } from './exams.validation';
import { auditMiddleware } from '../../middlewares/audit.middleware';
import { AuditAction } from '../../common/logger/audit';


const router: Router = Router();

/**
 * @openapi
 * /api/exams/sessions:
 *   post:
 *     tags:
 *       - Exams
 *     summary: Create exam session (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Session created
 */
router.post(
  '/sessions',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.CREATE),
  validate(createSessionSchema),
  examsController.createSession
);

/**
 * @openapi
 * /api/exams/sessions:
 *   get:
 *     tags:
 *       - Exams
 *     summary: List all exam sessions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sessions
 */
router.get(
  '/sessions',
  authenticate,
  examsController.getSessions
);

/**
 * @openapi
 * /api/exams/sessions/{id}:
 *   get:
 *     tags:
 *       - Exams
 *     summary: Get session by ID
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
 *         description: Session details
 */
router.get(
  '/sessions/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  examsController.getSessionById
);

/**
 * @openapi
 * /api/exams/sessions/{id}:
 *   put:
 *     tags:
 *       - Exams
 *     summary: Update session (Admin only)
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
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session updated
 */
router.put(
  '/sessions/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  validate(updateSessionSchema),
  examsController.updateSession
);

/**
 * @openapi
 * /api/exams/sessions/{id}:
 *   delete:
 *     tags:
 *       - Exams
 *     summary: Delete session (Admin only)
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
 *         description: Session deleted
 */
router.delete(
  '/sessions/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.DELETE),
  validate(idParamSchema, 'params'),
  examsController.deleteSession
);

/**
 * @openapi
 * /api/exams/centers:
 *   post:
 *     tags:
 *       - Exams
 *     summary: Create exam center (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               capacity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Center created
 */
router.post(
  '/centers',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.CREATE),
  validate(createCenterSchema),
  examsController.createCenter
);

/**
 * @openapi
 * /api/exams/centers:
 *   get:
 *     tags:
 *       - Exams
 *     summary: List all exam centers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of centers
 */
router.get(
  '/centers',
  authenticate,
  examsController.getCenters
);

/**
 * @openapi
 * /api/exams/centers/{id}:
 *   get:
 *     tags:
 *       - Exams
 *     summary: Get center by ID
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
 *         description: Center details
 */
router.get(
  '/centers/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  examsController.getCenterById
);

/**
 * @openapi
 * /api/exams/centers/{id}:
 *   put:
 *     tags:
 *       - Exams
 *     summary: Update center (Admin only)
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
 *               name:
 *                 type: string
 *               capacity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Center updated
 */
router.put(
  '/centers/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  validate(updateCenterSchema),
  examsController.updateCenter
);

/**
 * @openapi
 * /api/exams/centers/{id}:
 *   delete:
 *     tags:
 *       - Exams
 *     summary: Delete center (Admin only)
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
 *         description: Center deleted
 */
router.delete(
  '/centers/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.DELETE),
  validate(idParamSchema, 'params'),
  examsController.deleteCenter
);

/**
 * @openapi
 * /api/exams/assign:
 *   post:
 *     tags:
 *       - Exams
 *     summary: Assign candidates to centers (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Candidates assigned
 */
router.post(
  '/assign',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.ASSIGN),
  validate(assignCandidatesSchema),
  examsController.assignCandidates
);

/**
 * @openapi
 * /api/exams/my-assignment:
 *   get:
 *     tags:
 *       - Exams
 *     summary: Get current candidate's exam assignment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assignment details
 */
router.get(
  '/my-assignment',
  authenticate,
  examsController.getMyAssignment
);

export default router;