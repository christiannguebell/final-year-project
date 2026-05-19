import { Router } from 'express';
import { adminController } from './admin.controller';
import { authenticate, authorize } from '../../middlewares';
import { UserRole } from '../../database';

const router: Router = Router();

router.post('/create', authenticate, authorize(UserRole.SUPER_ADMIN), (req, res, next) => {
  adminController.createAdmin(req, res, next).catch(next);
});

router.post('/verify-otp', (req, res, next) => {
  adminController.verifyOtp(req, res, next).catch(next);
});

router.post('/setup-password', (req, res, next) => {
  adminController.setupPassword(req, res, next).catch(next);
});

router.post('/login', (req, res, next) => {
  adminController.login(req, res, next).catch(next);
});

router.post('/refresh-token', (req, res, next) => {
  adminController.refreshToken(req, res, next).catch(next);
});

router.post('/resend-otp', (req, res, next) => {
  adminController.resendOtp(req, res, next).catch(next);
});

router.get('/admins', authenticate, authorize(UserRole.SUPER_ADMIN), (req, res, next) => {
  adminController.getAdmins(req, res, next).catch(next);
});

router.get('/admins/:id', authenticate, authorize(UserRole.SUPER_ADMIN), (req, res, next) => {
  adminController.getAdminById(req, res, next).catch(next);
});

router.delete('/admins/:id', authenticate, authorize(UserRole.SUPER_ADMIN), (req, res, next) => {
  adminController.deleteAdmin(req, res, next).catch(next);
});

router.post('/forgot-password', (req, res, next) => {
  adminController.forgotPassword(req, res, next).catch(next);
});

router.post('/reset-password', (req, res, next) => {
  adminController.resetPassword(req, res, next).catch(next);
});

export default router;