# SEAS Examination Management System
## Database Entities, Fields and Relationships

This document defines all database entities, fields, and relationships for the SEAS Examination Management System using PostgreSQL.

---

## ENTITIES OVERVIEW

users
candidate_profiles
programs
applications
academic_records
documents
payments
exam_sessions
exam_centers
exam_assignments
results
result_scores
notifications

---

## USERS

Represents all authenticated actors (Candidate, Admin, Examiner).

Fields:
- id (uuid, PK)
- full_name (varchar, not null)
- email (varchar, unique, not null)
- phone (varchar)
- password_hash (varchar, not null)
- role (enum: CANDIDATE, ADMIN, EXAMINER)
- is_active (boolean, default true)
- created_at (timestamp)
- updated_at (timestamp)

Relationships:
- One User has one Candidate Profile
- One User receives many Notifications
- Admin Users verify Payments
- Admin Users create Exam Sessions

---

## CANDIDATE PROFILES

Stores candidate-specific information separate from authentication.

Fields:
- id (uuid, PK)
- user_id (uuid, FK → users.id)
- candidate_number (varchar, unique)
- date_of_birth (date)
- gender (varchar)
- nationality (varchar)
- address (text)
- emergency_contact (varchar)
- profile_photo (varchar)
- created_at (timestamp)

Relationships:
- User (1) → (1) CandidateProfile
- CandidateProfile (1) → (Many) Applications

---

## PROGRAMS

SEAS academic programs candidates apply for.

Fields:
- id (uuid, PK)
- name (varchar)
- description (text)
- department (varchar)
- is_active (boolean)

Relationships:
- Program (1) → (Many) Applications

---

## APPLICATIONS

Represents a candidate concours application.

Fields:
- id (uuid, PK)
- candidate_id (uuid, FK → candidate_profiles.id)
- program_id (uuid, FK → programs.id)
- status (enum: DRAFT, SUBMITTED, APPROVED, REJECTED)
- submission_date (timestamp)
- admin_comment (text)
- created_at (timestamp)

Relationships:
- CandidateProfile (1) → (Many) Applications
- Program (1) → (Many) Applications
- Application (1) → AcademicRecord
- Application (1) → Payment
- Application (1) → Result
- Application (1) → Many Documents
- Application (1) → ExamAssignment

---

## ACADEMIC RECORDS

Academic background attached to an application.

Fields:
- id (uuid, PK)
- application_id (uuid, FK → applications.id)
- previous_school (varchar)
- qualification (varchar)
- graduation_year (int)
- gpa (numeric)

Relationships:
- Application (1) → (1) AcademicRecord

---

## DOCUMENTS

Uploaded application documents.

Fields:
- id (uuid, PK)
- application_id (uuid, FK → applications.id)
- document_type (enum: ID_CARD, BIRTH_CERTIFICATE, TRANSCRIPT, PASSPORT_PHOTO)
- file_url (varchar)
- status (enum: PENDING, VERIFIED, REJECTED)
- uploaded_at (timestamp)

Relationships:
- Application (1) → (Many) Documents

---

## PAYMENTS

Tracks concours fee payments.

Fields:
- id (uuid, PK)
- application_id (uuid, FK → applications.id)
- amount (numeric)
- method (enum)
- transaction_reference (varchar)
- receipt_url (varchar)
- status (enum: PENDING, VERIFIED, REJECTED)
- verified_by (uuid, FK → users.id, nullable)
- paid_at (timestamp)

Relationships:
- Application (1) → (1) Payment
- Admin User verifies Payment

---

## EXAM SESSIONS

Represents a concours session.

Fields:
- id (uuid, PK)
- name (varchar)
- exam_date (date)
- registration_deadline (date)
- created_by (uuid, FK → users.id)

Relationships:
- ExamSession (1) → (Many) ExamAssignments

---

## EXAM CENTERS

Physical exam locations.

Fields:
- id (uuid, PK)
- name (varchar)
- location (varchar)
- capacity (int)

Relationships:
- ExamCenter (1) → (Many) ExamAssignments

---

## EXAM ASSIGNMENTS

Links applications to exam sessions and centers (used to generate exam slips).

Fields:
- id (uuid, PK)
- application_id (uuid, FK → applications.id)
- exam_session_id (uuid, FK → exam_sessions.id)
- exam_center_id (uuid, FK → exam_centers.id)
- seat_number (varchar)

Relationships:
- Application (1) → (1) ExamAssignment
- ExamSession (1) → (Many) ExamAssignments
- ExamCenter (1) → (Many) ExamAssignments

---

## RESULTS

Stores final examination outcome.

Fields:
- id (uuid, PK)
- application_id (uuid, FK → applications.id)
- total_score (numeric)
- rank (int)
- admission_status (enum: ADMITTED, NOT_ADMITTED, WAITLISTED)
- published_at (timestamp)

Relationships:
- Application (1) → (1) Result
- Result (1) → (Many) ResultScores

---

## RESULT SCORES

Subject-level marks.

Fields:
- id (uuid, PK)
- result_id (uuid, FK → results.id)
- subject_name (varchar)
- score (numeric)

Relationships:
- Result (1) → (Many) ResultScores

---

## NOTIFICATIONS

System-generated messages sent to users.

Fields:
- id (uuid, PK)
- user_id (uuid, FK → users.id)
- title (varchar)
- message (text)
- type (enum)
- is_read (boolean)
- created_at (timestamp)

Relationships:
- User (1) → (Many) Notifications

---

## RELATIONSHIP SUMMARY

User
├── CandidateProfile
├── Notifications
└── (Admin actions)

CandidateProfile
└── Applications

Application
├── AcademicRecord
├── Documents
├── Payment
├── ExamAssignment
└── Result

ExamSession ── ExamAssignment ── ExamCenter

Result ── ResultScores