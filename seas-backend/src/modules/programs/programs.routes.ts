import { Router } from 'express';
import { programsController } from './programs.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { idParamSchema, createProgramSchema, updateProgramSchema, listProgramsSchema } from './programs.validation';
import { auditMiddleware } from '../../middlewares/audit.middleware';
import { AuditAction } from '../../common/logger/audit';


const router: Router = Router();

/**
 * @openapi
 * /api/programs:
 *   post:
 *     tags:
 *       - Programs
 *     summary: Create a new program (Admin only)
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
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Program created
 */
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.CREATE),
  validate(createProgramSchema),
  programsController.create
);

/**
 * @openapi
 * /api/programs:
 *   get:
 *     tags:
 *       - Programs
 *     summary: List all programs
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
 *     responses:
 *       200:
 *         description: List of programs
 */
router.get(
  '/',
  authenticate,
  validate(listProgramsSchema, 'query'),
  programsController.getAll
);

/**
 * @openapi
 * /api/programs/{id}:
 *   get:
 *     tags:
 *       - Programs
 *     summary: Get program by ID
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
 *         description: Program details
 */
router.get(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  programsController.getById
);

/**
 * @openapi
 * /api/programs/{id}:
 *   put:
 *     tags:
 *       - Programs
 *     summary: Update program (Admin only)
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Program updated
 */
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  validate(updateProgramSchema),
  programsController.update
);

/**
 * @openapi
 * /api/programs/{id}/activate:
 *   patch:
 *     tags:
 *       - Programs
 *     summary: Activate program (Admin only)
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
 *         description: Program activated
 */
router.patch(
  '/:id/activate',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  programsController.activate
);

/**
 * @openapi
 * /api/programs/{id}/deactivate:
 *   patch:
 *     tags:
 *       - Programs
 *     summary: Deactivate program (Admin only)
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
 *         description: Program deactivated
 */
router.patch(
  '/:id/deactivate',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  programsController.deactivate
);

/**
 * @openapi
 * /api/programs/{id}:
 *   delete:
 *     tags:
 *       - Programs
 *     summary: Delete program (Admin only)
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
 *         description: Program deleted
 */
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.DELETE),
  validate(idParamSchema, 'params'),
  programsController.delete
);


export default router;