import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { isAdmin } from '../../middlewares/role.middleware';

const router: Router = Router();

router.use(authenticate, isAdmin);

/**
 * @openapi
 * /api/analytics/dashboard:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get overall dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved
 */
router.get('/dashboard', analyticsController.getDashboardStats);

/**
 * @openapi
 * /api/analytics/programs:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get application distribution across programs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Program distribution retrieved
 */
router.get('/programs', analyticsController.getProgramDistribution);

export default router;
