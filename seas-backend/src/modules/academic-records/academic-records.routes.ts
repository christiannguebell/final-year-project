import { Router } from 'express';
import { academicRecordsController } from './academic-records.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { createAcademicRecordSchema, updateAcademicRecordSchema } from './academic-records.validation';

const router: Router = Router();

router.post('/', authenticate, validate(createAcademicRecordSchema), academicRecordsController.create);
router.get('/application/:applicationId', authenticate, academicRecordsController.getByApplicationId);
router.get('/:id', authenticate, academicRecordsController.getById);
router.put('/:id', authenticate, validate(updateAcademicRecordSchema), academicRecordsController.update);
router.delete('/:id', authenticate, academicRecordsController.delete);

export default router;
