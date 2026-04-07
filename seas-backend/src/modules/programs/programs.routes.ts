import { Router } from 'express';
import { programsController } from './programs.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '../../database';
import { idParamSchema, createProgramSchema, updateProgramSchema, listProgramsSchema } from './programs.validation';

const router: Router = Router();

router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createProgramSchema),
  programsController.create
);

router.get(
  '/',
  authenticate,
  validate(listProgramsSchema, 'query'),
  programsController.getAll
);

router.get(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  programsController.getById
);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  validate(updateProgramSchema),
  programsController.update
);

router.patch(
  '/:id/activate',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  programsController.activate
);

router.patch(
  '/:id/deactivate',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  programsController.deactivate
);

router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  programsController.delete
);

export default router;