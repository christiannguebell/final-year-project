import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import usersRoutes from '../modules/users/users.routes';
import candidatesRoutes from '../modules/candidates/candidates.routes';
import programsRoutes from '../modules/programs/programs.routes';
import applicationsRoutes from '../modules/applications/applications.routes';
import documentsRoutes from '../modules/documents/documents.routes';
import paymentsRoutes from '../modules/payments/payments.routes';
import examsRoutes from '../modules/exams/exams.routes';
import resultsRoutes from '../modules/results/results.routes';
import notificationsRoutes from '../modules/notifications/notifications.routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/candidates', candidatesRoutes);
router.use('/programs', programsRoutes);
router.use('/applications', applicationsRoutes);
router.use('/documents', documentsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/exams', examsRoutes);
router.use('/results', resultsRoutes);
router.use('/notifications', notificationsRoutes);

export default router;
