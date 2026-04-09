import { Router } from 'express';
import { systemController } from './system.controller';

const router: Router = Router();

/**
 * @openapi
 * /api/system/health:
 *   get:
 *     tags:
 *       - System
 *     summary: System Health Check (CI/CD / Uptime)
 *     security: []
 *     responses:
 *       200:
 *         description: OK
 *       503:
 *         description: Service Unavailable (Database down)
 */
router.get('/health', systemController.getHealth);

/**
 * @openapi
 * /api/system/public-stats:
 *   get:
 *     tags:
 *       - System
 *     summary: Aggregated public system statistics
 *     security: []
 *     responses:
 *       200:
 *         description: Public stats returned
 */
router.get('/public-stats', systemController.getPublicStats);

export default router;
