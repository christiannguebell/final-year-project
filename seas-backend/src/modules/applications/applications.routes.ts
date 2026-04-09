import { Router } from 'express';
import { applicationsController } from './applications.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { idParamSchema, createApplicationSchema, updateApplicationSchema, listApplicationsSchema } from './applications.validation';
import { auditMiddleware } from '../../middlewares/audit.middleware';
import { AuditAction } from '../../common/logger/audit';


const router: Router = Router();

/**
 * @openapi
 * /api/applications:
 *   post:
 *     tags:
 *       - Applications
 *     summary: Create application
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - programId
 *             properties:
 *               programId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application created
 */
router.post(
  '/',
  authenticate,
  validate(createApplicationSchema),
  applicationsController.create
);

/**
 * @openapi
 * /api/applications/mine:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Get current candidate's applications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 */
router.get(
  '/mine',
  authenticate,
  applicationsController.getMyApplications
);

/**
 * @openapi
 * /api/applications:
 *   get:
 *     tags:
 *       - Applications
 *     summary: List all applications (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of applications
 */
router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(listApplicationsSchema, 'query'),
  applicationsController.getAll
);

/**
 * @openapi
 * /api/applications/{id}:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Get application by ID
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
 *         description: Application details
 */
router.get(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  applicationsController.getById
);

/**
 * @openapi
 * /api/applications/{id}:
 *   put:
 *     tags:
 *       - Applications
 *     summary: Update application
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
 *               programId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application updated
 */
router.put(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  validate(updateApplicationSchema),
  applicationsController.update
);

/**
 * @openapi
 * /api/applications/{id}/submit:
 *   post:
 *     tags:
 *       - Applications
 *     summary: Submit application
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
 *         description: Application submitted
 */
router.post(
  '/:id/submit',
  authenticate,
  validate(idParamSchema, 'params'),
  applicationsController.submit
);

/**
 * @openapi
 * /api/applications/{id}/approve:
 *   patch:
 *     tags:
 *       - Applications
 *     summary: Approve application (Admin only)
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
 *         description: Application approved
 */
router.patch(
  '/:id/approve',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.APPROVE),
  validate(idParamSchema, 'params'),
  applicationsController.approve
);

/**
 * @openapi
 * /api/applications/{id}/reject:
 *   patch:
 *     tags:
 *       - Applications
 *     summary: Reject application (Admin only)
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
 *         description: Application rejected
 */
router.patch(
  '/:id/reject',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.REJECT),
  validate(idParamSchema, 'params'),
  applicationsController.reject
);

/**
 * @openapi
 * /api/applications/{id}:
 *   delete:
 *     tags:
 *       - Applications
 *     summary: Delete application
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
 *         description: Application deleted
 */
router.delete(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  applicationsController.delete
);

export default router;