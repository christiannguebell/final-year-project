export interface CandidateProfile {
  id?: string;
  userId: string;
  candidateNumber?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  address?: string;
  city?: string;
  country?: string;
  profilePhoto?: string;
  idType?: string;
  idNumber?: string;
  zipCode?: string;
}

export interface AcademicRecord {
  id?: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  grade: string;
  fieldOfStudy: string;
}

export interface Program {
  id: string;
  name: string;
  code: string;
  description: string;
  degreeLevel: string;
  durationYears: number;
  entryRequirements: string;
}

export interface Payment {
  id: string;
  applicationId: string;
  amount: number;
  paymentDate: string;
  receiptFile?: string;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  createdAt?: string;
}

export interface Application {
  id?: string;
  userId: string;
  programId: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  personalStatement?: string;
  candidate?: any;
  program?: Program;
  academicRecords?: AcademicRecord[];
  documents?: any[];
  payments?: Payment[];
  createdAt?: string;
  updatedAt?: string;
}
