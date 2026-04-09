# SEAS Examination System — Dual Frontend Development Plan

> Two specialized SPAs | React + TypeScript + Vite + Tailwind CSS

---

## Architecture Overview

Instead of a single monolithic frontend, the system is split into two distinct applications to ensure better security, smaller bundle sizes, and specialized user experiences.

1.  **SEAS Public (`seas-public`)**: Focuses on Candidate registration, application submission, payment, and result checking.
2.  **SEAS Admin (`seas-admin`)**: Focuses on system administration, user management, center allocation, and result publication.

---

## Phase 1: Shared Foundation (Parallel)

**Goal:** Establish consistency across both apps.

### Core Dependencies (Both)
- `react-router-dom` (Routing)
- `axios` (API client)
- `@tanstack/react-query` (Data fetching)
- `zustand` (State)
- `react-hook-form` + `zod` (Validation)
- `tailwind-merge` + `clsx` (Styling utils)
- `lucide-react` (Icons)

### Shared Design System
- Define a unified color palette in Tailwind configs.
- Create a shared `ui` library pattern for Buttons, Inputs, and Cards to ensure visual consistency.

---

## Phase 2: SEAS Public Development (`seas-public`)

**Goal:** The candidate-facing portal.

### Modules:
1.  **Auth**: Registration, OTP/Verification, Login, Password Recovery.
2.  **Profile**: Candidate Portfolio, Bio-data, Academic History.
3.  **Application**: Multi-step program selection and document upload.
4.  **Documents**: View/Replace personal documents.
5.  **Payments**: Upload receipts and track verification status.
6.  **Exams**: Download Exam Slip (PDF).
7.  **Results**: Check individual ranking and final score.

---

## Phase 3: SEAS Admin Development (`seas-admin`)

**Goal:** The administrative control center.

### Modules:
1.  **Dashboard**: High-level metrics and system health.
2.  **User Management**: Role-based access control, account activation.
3.  **Programs**: Management of departments and examination subjects.
4.  **Review System**: Verification of applications, documents, and payments.
5.  **Logistics**: Exam session scheduling and Center capacity management.
6.  **Assignment Engine**: Triggering candidate-to-center allocation.
7.  **Result Processing**: Score entry (Manual/Bulk) and publication.
8.  **Broadcasting**: Sending system-wide notifications.

---

## Phase 4: Cross-App Integration

**Goal:** Ensure smooth handovers and consistent data.

1.  **API Shared Logic**: Standardize error codes and response handling.
2.  **Deployment**: Configure two separate Docker containers or deployment targets.
3.  **CORS**: Update backend `cors` configuration to allow both frontend origins.

---

## Technical Stack

| Category         | Package                             |
|------------------|-------------------------------------|
| Framework        | React 19 + Vite                     |
| Styling          | Tailwind CSS                        |
| Animations       | Framer Motion                       |
| Store            | Zustand                             |
| Forms            | React Hook Form                     |
| Documentation    | Storybook (Optional)                |
