import Joi from 'joi';

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  phone: Joi.string().max(20).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
  phone: Joi.string().max(20).optional(),
  status: Joi.string().valid('active', 'inactive', 'pending').optional(),
});

export const createApplicationSchema = Joi.object({
  programId: Joi.string().uuid().required(),
  personalStatement: Joi.string().max(5000).optional(),
});

export const updateApplicationSchema = Joi.object({
  personalStatement: Joi.string().max(5000).optional(),
  programId: Joi.string().uuid().optional(),
});

export const createPaymentSchema = Joi.object({
  applicationId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  paymentDate: Joi.date().iso().required(),
});

export const updatePaymentStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'verified', 'rejected').required(),
  notes: Joi.string().max(500).optional(),
});

export const createDocumentSchema = Joi.object({
  applicationId: Joi.string().uuid().required(),
  type: Joi.string()
    .valid('id_card', 'passport', 'photo', 'certificate', 'transcript', 'other')
    .required(),
});

export const updateDocumentStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'verified', 'rejected').required(),
  notes: Joi.string().max(500).optional(),
});

export const createExamSessionSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  examDate: Joi.date().iso().required(),
  registrationStart: Joi.date().iso().optional(),
  registrationEnd: Joi.date().iso().optional(),
  description: Joi.string().max(1000).optional(),
});

export const createExamCenterSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  address: Joi.string().min(1).max(500).required(),
  capacity: Joi.number().integer().positive().required(),
});

export const createProgramSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  code: Joi.string().min(1).max(50).required(),
  description: Joi.string().max(2000).optional(),
  duration: Joi.string().max(50).optional(),
  requirements: Joi.string().max(5000).optional(),
});

export const updateProgramSchema = Joi.object({
  name: Joi.string().min(1).max(200).optional(),
  description: Joi.string().max(2000).optional(),
  duration: Joi.string().max(50).optional(),
  requirements: Joi.string().max(5000).optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
});

export const createExamAssignmentSchema = Joi.object({
  applicationId: Joi.string().uuid().required(),
  sessionId: Joi.string().uuid().required(),
  centerId: Joi.string().uuid().required(),
  seatNumber: Joi.string().min(1).max(20).required(),
  examTime: Joi.date().iso().optional(),
});

export const enterResultSchema = Joi.object({
  applicationId: Joi.string().uuid().required(),
  sessionId: Joi.string().uuid().required(),
  scores: Joi.array()
    .items(
      Joi.object({
        subject: Joi.string().min(1).max(100).required(),
        score: Joi.number().min(0).max(100).required(),
      })
    )
    .min(1)
    .required(),
});

export const createNotificationSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  type: Joi.string()
    .valid('application', 'payment', 'exam', 'result', 'system')
    .required(),
  title: Joi.string().min(1).max(200).required(),
  message: Joi.string().min(1).max(2000).required(),
  link: Joi.string().uri().optional(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).max(100).required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).max(100).required(),
});

export const searchQuerySchema = Joi.object({
  q: Joi.string().max(100).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().max(50).optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

export const filterSchema = Joi.object({
  status: Joi.string().optional(),
  type: Joi.string().optional(),
  fromDate: Joi.date().iso().optional(),
  toDate: Joi.date().iso().optional(),
});