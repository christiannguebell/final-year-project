import { Router } from 'express';
import { usersController } from './users.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { auditMiddleware } from '../../middlewares/audit.middleware';
import { AuditAction } from '../../common/logger/audit';
import { idParamSchema, updateUserSchema, listUsersSchema } from './users.validation';

const router: Router = Router();


/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: List all users (Admin only)
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
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 */
router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(listUsersSchema, 'query'),
  usersController.getAll
);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID (Admin only)
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
 *         description: User details
 */
router.get(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  usersController.getById
);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user (Admin only)
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  validate(updateUserSchema),
  usersController.update
);

/**
 * @openapi
 * /api/users/{id}/activate:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Activate user (Admin only)
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
 *         description: User activated
 */
router.patch(
  '/:id/activate',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  usersController.activate
);

/**
 * @openapi
 * /api/users/{id}/deactivate:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Deactivate user (Admin only)
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
 *         description: User deactivated
 */
router.patch(
  '/:id/deactivate',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.UPDATE),
  validate(idParamSchema, 'params'),
  usersController.deactivate
);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user (Admin only)
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
 *         description: User deleted
 */
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  auditMiddleware(AuditAction.DELETE),
  validate(idParamSchema, 'params'),
  usersController.delete
);


export default router;