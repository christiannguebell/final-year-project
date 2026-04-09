import { Router } from 'express';
import { candidatesController } from './candidates.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { uploadLimiter } from '../../middlewares/security.middleware';
import { createCandidateSchema, updateCandidateSchema, idParamSchema } from './candidates.validation';

const router: Router = Router();

/**
 * @openapi
 * /api/candidates:
 *   post:
 *     tags:
 *       - Candidates
 *     summary: Create candidate profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profile created
 */
router.post(
  '/',
  authenticate,
  validate(createCandidateSchema),
  candidatesController.create
);

/**
 * @openapi
 * /api/candidates/me:
 *   get:
 *     tags:
 *       - Candidates
 *     summary: Get current candidate profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details
 */
router.get(
  '/me',
  authenticate,
  candidatesController.getMyProfile
);

/**
 * @openapi
 * /api/candidates/{id}:
 *   get:
 *     tags:
 *       - Candidates
 *     summary: Get candidate profile by ID
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
 *         description: Profile details
 */
router.get(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  candidatesController.getById
);

/**
 * @openapi
 * /api/candidates:
 *   put:
 *     tags:
 *       - Candidates
 *     summary: Update current candidate profile
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put(
  '/',
  authenticate,
  validate(updateCandidateSchema),
  candidatesController.update
);

/**
 * @openapi
 * /api/candidates/photo:
 *   post:
 *     tags:
 *       - Candidates
 *     summary: Upload profile photo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded
 */
router.post(
  '/photo',
  authenticate,
  uploadLimiter,
  upload.single('photo'),
  candidatesController.updateProfilePhoto
);


export default router;