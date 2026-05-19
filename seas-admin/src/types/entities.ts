export interface Candidate {
  id: string;
  userId: string;
  candidateNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  verified?: boolean;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  nationality?: string;
  address?: string;
  city?: string;
  country?: string;
  photoUrl?: string;
  profile?: Profile;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  candidateNumber: string;
  dateOfBirth?: string;
  gender?: Gender;
  nationality?: string;
  address?: string;
  city?: string;
  country?: string;
  profilePhoto?: string;
  idType?: string;
  idNumber?: string;
  zipCode?: string;
  createdAt: string;
  updatedAt: string;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export interface Program {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  candidateId: string;
  programId: string;
  program?: Program;
  candidate?: Candidate;
  status: ApplicationStatus;
  submittedAt?: string;
  documents?: Document[];
  createdAt: string;
  updatedAt: string;
}

export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Document {
  id: string;
  candidateId: string;
  type: DocumentType;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export enum DocumentType {
  PHOTO = 'photo',
  ID_CARD = 'id_card',
  ACADEMIC_RECORD = 'academic_record',
  CERTIFICATE = 'certificate',
  OTHER = 'other',
}

export interface Payment {
  id: string;
  candidateId: string;
  applicationId: string;
  candidate?: Candidate;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: string;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

export enum PaymentStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  VERIFIED = 'verified',
  FLAGGED = 'flagged',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface ExamSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: ExamSessionStatus;
  createdAt: string;
  updatedAt: string;
}

export enum ExamSessionStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export interface ExamCenter {
  id: string;
  name: string;
  location: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExamAssignment {
  id: string;
  candidateId: string;
  sessionId: string;
  centerId: string;
  center?: ExamCenter;
  session?: ExamSession;
  createdAt: string;
}

export interface Result {
  id: string;
  candidateId: string;
  sessionId: string;
  score: number;
  percentile?: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  candidateId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}