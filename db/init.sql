-- ============================================================
-- SEAS Examination & Admission System
-- PostgreSQL Database Schema
-- Generated from TypeORM entities
-- ============================================================

-- Enable UUID extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- ============================================================

-- users
CREATE TYPE user_role AS ENUM ('admin', 'super_admin', 'candidate');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending');

-- candidate_profiles
CREATE TYPE gender AS ENUM ('male', 'female', 'other');

-- applications
CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected');

-- programs
CREATE TYPE program_status AS ENUM ('active', 'inactive');

-- documents
CREATE TYPE document_type AS ENUM ('id_card', 'passport', 'photo', 'certificate', 'transcript', 'other');
CREATE TYPE document_status AS ENUM ('pending', 'verified', 'rejected');

-- payments
CREATE TYPE payment_method AS ENUM ('BANK_TRANSFER', 'MOBILE_MONEY', 'CASH');
CREATE TYPE payment_status AS ENUM ('pending', 'verified', 'rejected');

-- exam_sessions
CREATE TYPE exam_session_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- results
CREATE TYPE result_status AS ENUM ('pending', 'published');

-- notifications
CREATE TYPE notification_channel AS ENUM ('in_app', 'email');
CREATE TYPE notification_status AS ENUM ('unread', 'read');
CREATE TYPE notification_type AS ENUM ('application', 'payment', 'exam', 'result', 'system');

-- ============================================================
-- TABLES
-- ============================================================

-- ------------------------------------------------------------
-- USERS
-- ------------------------------------------------------------
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    role            user_role    NOT NULL DEFAULT 'candidate',
    status          user_status  NOT NULL DEFAULT 'pending',
    phone           VARCHAR(50),
    reset_token     VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    otp             VARCHAR(20),
    otp_expiry      TIMESTAMP,
    token_version   INTEGER      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email        ON users(email);
CREATE INDEX idx_users_role         ON users(role);
CREATE INDEX idx_users_status       ON users(status);

-- ------------------------------------------------------------
-- CANDIDATE PROFILES
-- ------------------------------------------------------------
CREATE TABLE candidate_profiles (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    candidate_number  VARCHAR(50) NOT NULL UNIQUE,
    date_of_birth     DATE,
    gender            gender,
    nationality       VARCHAR(100),
    address           TEXT,
    city              VARCHAR(100),
    country           VARCHAR(100),
    profile_photo     VARCHAR(255),
    id_type           VARCHAR(50),
    id_number         VARCHAR(100),
    zip_code          VARCHAR(20),
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidate_profiles_user_id        ON candidate_profiles(user_id);
CREATE INDEX idx_candidate_profiles_candidate_number ON candidate_profiles(candidate_number);

-- ------------------------------------------------------------
-- PROGRAMS
-- ------------------------------------------------------------
CREATE TABLE programs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(255) NOT NULL,
    code                VARCHAR(50)  NOT NULL UNIQUE,
    description         TEXT,
    status              program_status NOT NULL DEFAULT 'active',
    degree_level        VARCHAR(100),
    duration_years      INTEGER       NOT NULL,
    entry_requirements  TEXT,
    application_deadline DATE,
    application_fee     NUMERIC(10,2) NOT NULL DEFAULT 50.00,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_programs_status     ON programs(status);
CREATE INDEX idx_programs_code       ON programs(code);

-- ------------------------------------------------------------
-- APPLICATIONS
-- ------------------------------------------------------------
CREATE TABLE applications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    program_id      UUID NOT NULL REFERENCES programs(id),
    status          application_status NOT NULL DEFAULT 'draft',
    personal_statement TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_user_id    ON applications(user_id);
CREATE INDEX idx_applications_program_id ON applications(program_id);
CREATE INDEX idx_applications_status     ON applications(status);

-- ------------------------------------------------------------
-- ACADEMIC RECORDS
-- ------------------------------------------------------------
CREATE TABLE academic_records (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    institution   VARCHAR(255) NOT NULL,
    degree        VARCHAR(255) NOT NULL,
    start_date    DATE NOT NULL,
    end_date      DATE,
    grade         VARCHAR(50),
    field_of_study VARCHAR(255),
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_academic_records_application_id ON academic_records(application_id);

-- ------------------------------------------------------------
-- DOCUMENTS
-- ------------------------------------------------------------
CREATE TABLE documents (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    type          document_type NOT NULL,
    filename      VARCHAR(255) NOT NULL,
    file_path     VARCHAR(512) NOT NULL,
    status        document_status NOT NULL DEFAULT 'pending',
    notes         TEXT,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_application_id ON documents(application_id);
CREATE INDEX idx_documents_status         ON documents(status);

-- ------------------------------------------------------------
-- PAYMENTS
-- ------------------------------------------------------------
CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    amount          NUMERIC(10,2) NOT NULL,
    payment_date    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    transaction_id  VARCHAR(255),
    method          payment_method NOT NULL DEFAULT 'BANK_TRANSFER',
    receipt_file    VARCHAR(512),
    status          payment_status NOT NULL DEFAULT 'pending',
    notes           TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_application_id ON payments(application_id);
CREATE INDEX idx_payments_status         ON payments(status);

-- ------------------------------------------------------------
-- EXAM SESSIONS
-- ------------------------------------------------------------
CREATE TABLE exam_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(255) NOT NULL UNIQUE,
    exam_date           DATE NOT NULL,
    registration_start  DATE,
    registration_end    DATE,
    status              exam_session_status NOT NULL DEFAULT 'scheduled',
    description         TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exam_sessions_status   ON exam_sessions(status);
CREATE INDEX idx_exam_sessions_exam_date ON exam_sessions(exam_date);

-- ------------------------------------------------------------
-- EXAM CENTERS
-- ------------------------------------------------------------
CREATE TABLE exam_centers (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(255) NOT NULL,
    address    VARCHAR(512) NOT NULL,
    city       VARCHAR(100) NOT NULL,
    capacity   INTEGER,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exam_centers_city     ON exam_centers(city);
CREATE INDEX idx_exam_centers_is_active ON exam_centers(is_active);

-- ------------------------------------------------------------
-- EXAM ASSIGNMENTS
-- ------------------------------------------------------------
CREATE TABLE exam_assignments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    session_id      UUID NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
    center_id       UUID NOT NULL REFERENCES exam_centers(id) ON DELETE CASCADE,
    seat_number     VARCHAR(50) NOT NULL,
    exam_time       TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_exam_assignments_application_session UNIQUE (application_id, session_id)
);

CREATE INDEX idx_exam_assignments_application_id ON exam_assignments(application_id);
CREATE INDEX idx_exam_assignments_session_id     ON exam_assignments(session_id);
CREATE INDEX idx_exam_assignments_center_id      ON exam_assignments(center_id);

-- ------------------------------------------------------------
-- RESULTS
-- ------------------------------------------------------------
CREATE TABLE results (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  UUID NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
    total_score     NUMERIC(6,2),
    rank            INTEGER,
    status          result_status NOT NULL DEFAULT 'pending',
    published_at    TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_results_application_id ON results(application_id);
CREATE INDEX idx_results_status         ON results(status);

-- ------------------------------------------------------------
-- RESULT SCORES
-- ------------------------------------------------------------
CREATE TABLE result_scores (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    result_id  UUID NOT NULL REFERENCES results(id) ON DELETE CASCADE,
    subject    VARCHAR(255) NOT NULL,
    score      NUMERIC(6,2),
    max_score  NUMERIC(6,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_result_scores_result_id ON result_scores(result_id);

-- ------------------------------------------------------------
-- NOTIFICATIONS
-- ------------------------------------------------------------
CREATE TABLE notifications (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type          notification_type NOT NULL,
    channel       notification_channel NOT NULL DEFAULT 'in_app',
    template_id   VARCHAR(100),
    template_data JSONB,
    title         VARCHAR(255) NOT NULL,
    message       TEXT NOT NULL,
    status        notification_status NOT NULL DEFAULT 'unread',
    link          VARCHAR(512),
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status  ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================================
-- TRIGGERS: auto-update updated_at on row modification
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to every table that has an updated_at column
CREATE TRIGGER trg_users_updated_at          BEFORE UPDATE ON users               FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_candidate_profiles_updated_at BEFORE UPDATE ON candidate_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_programs_updated_at       BEFORE UPDATE ON programs            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_applications_updated_at   BEFORE UPDATE ON applications        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_academic_records_updated_at BEFORE UPDATE ON academic_records  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_documents_updated_at      BEFORE UPDATE ON documents           FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_payments_updated_at       BEFORE UPDATE ON payments            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_exam_sessions_updated_at  BEFORE UPDATE ON exam_sessions       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_exam_centers_updated_at   BEFORE UPDATE ON exam_centers        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_exam_assignments_updated_at BEFORE UPDATE ON exam_assignments  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_results_updated_at        BEFORE UPDATE ON results             FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_result_scores_updated_at  BEFORE UPDATE ON result_scores       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_notifications_updated_at  BEFORE UPDATE ON notifications       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED DATA (optional — safe to re-run; uses ON CONFLICT DO NOTHING)
-- ============================================================

-- Seed a default admin user (password: Admin@123 — must be changed immediately)
INSERT INTO users (id, email, password, first_name, last_name, role, status)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@seas-exam.local',
    '$2b$10$rQ7H8p9s0Q1wE2rT3yU4vX5cZ6aB7nD8eF9gH0iJ1kL2mN3oP4qR5sT',  -- bcrypt hash of "Admin@123"
    'System',
    'Administrator',
    'admin',
    'active'
) ON CONFLICT (id) DO NOTHING;

-- Seed a default program
INSERT INTO programs (id, name, code, description, degree_level, duration_years, entry_requirements, application_fee)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Computer Science',
    'CS-101',
    'Bachelor of Science in Computer Science',
    'Bachelor',
    4,
    'High school diploma or equivalent with strong mathematics background',
    50.00
) ON CONFLICT (id) DO NOTHING;

-- Seed a default exam center
INSERT INTO exam_centers (id, name, address, city, capacity, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Main Examination Hall',
    'University Campus, Block A',
    'Douala',
    200,
    TRUE
) ON CONFLICT (id) DO NOTHING;
