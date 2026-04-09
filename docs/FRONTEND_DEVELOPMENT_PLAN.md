# SEAS Examination System — Frontend Development Plan

> SPA | React + TypeScript + Vite + Tailwind CSS

---

## Phase 1: Project Setup & Foundation

**Goal:** Establish the project baseline, configure tooling, and define the design system.

### Tasks

1. Initialize Vite project with React and TypeScript [COMPLETED]
2. Configure `pnpm` workspace [COMPLETED]
3. Install core dependencies
   - `react-router-dom` — Routing
   - `axios` — API client
   - `@tanstack/react-query` — Data fetching & caching
   - `zustand` — State management
   - `react-hook-form` + `zod` — Form handling & validation
   - `lucide-react` — Iconography
   - `date-fns` — Date manipulation
4. Setup Tailwind CSS (Vite integration)
5. Configure Path Aliases (`@/*` to `src/*`) in `vite.config.ts` and `tsconfig.json`
6. Setup Global Error Boundary and Suspense boundaries
7. Setup ESLint + Prettier (matching backend standards)

### Folder Structure

```
seas-frontend/
├── src/
│   ├── api/                # Axios instances, API services
│   ├── assets/             # Images, fonts, global styles
│   ├── components/         # Shared components
│   │   ├── common/         # Low-level UI (Buttons, Inputs)
│   │   ├── layout/         # Grid, Navbar, Sidebar
│   │   └── modules/        # Domain-specific components
│   ├── config/             # Environment variables, constants
│   ├── hooks/              # Reusable custom hooks
│   ├── layouts/            # Page layouts (AuthLayout, DashboardLayout)
│   ├── pages/              # View components (Routing entries)
│   ├── store/              # Zustand global state (auth, ui)
│   ├── types/              # TypeScript interfaces/enums
│   ├── utils/              # Helper functions
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── public/
└── tailwind.config.js
```

---

## Phase 2: Core Layer & API Integration

**Goal:** Build the communication bridge between frontend and backend.

### Tasks

1. Setup Axios instance with interceptors (Request for JWT, Response for error handling)
2. Implement `apiClient` service (CRUD helpers)
3. Setup React Query `QueryClientProvider`
4. Define Global Types (User, Role, ApplicationStatus)
5. Build the Authentication Store (`zustand`)
6. Create Public vs Private Route guards

---

## Phase 3: Auth & Identity Module

**Goal:** User entry points and account security.

### Tasks

1. Create Layouts (AuthLayout with background/branding)
2. Implement **Login** page
3. Implement **Registration** page with role selection
4. Implement **Forgot/Reset Password** flow
5. Setup "My Account" / Profile settings page
6. Handle JWT session persistence (LocalStorage/State)

---

## Phase 4: Branding & Design System

**Goal:** Create a premium look and feel.

### Tasks

1. Define a sleek color palette (Hono/Dark Mode compatible)
2. Build core UI components:
   - Button (Gradients, Hover effects)
   - Input/Select/Checkbox (Clean labels, error states)
   - Data Table (Sorting, Pagination integration)
   - Modal/Drawer (Animations with `framer-motion`)
   - Notification Toast system

---

## Phase 5: Candidate Dashboard & Application Flow

**Goal:** The primary candidate experience.

### Tasks

1. Candidate Dashboard (Application status overview)
2. **Multi-step Application Form**:
   - Personal Info
   - Academic Record Entry
   - Program Selection
3. **Document Management**:
   - File upload progress indicators
   - Previewing uploaded files
4. Final Submission flow with summary check

---

## Phase 6: Admin Dashboard & User Management

**Goal:** System oversight and control.

### Tasks

1. Admin Dashboard (Stats cards: Total users, active apps, revenue)
2. User Management Table:
   - Search/Filter by role/status
   - Manual activation/deactivation
3. Program Management:
   - CRUD for school programs

---

## Phase 7: Application Review & Validation (Admin)

**Goal:** Admin workflow for processing candidates.

### Tasks

1. List view for all submitted applications
2. Detailed application review page:
   - Document verification panel
   - View academic history
3. Approve/Reject actions with feedback comments

---

## Phase 8: Exams & Center Management

**Goal:** Logistical coordination of the entrance exam.

### Tasks

1. **Center Management**: CRUD for exam locations
2. **Exam Sessions**: Create/Date scheduling
3. **Assignment Panel**: Trigger candidate allocation logic
4. **Exam Slip**: Generate/Download PDF exam slip (printing view)

---

## Phase 9: Payments & Verification Flow

**Goal:** Revenue tracking and status updates.

### Tasks

1. Candidate: Upload payment receipt
2. Admin: Payment verification queue
3. Visual timeline/stepper for payment -> exam -> result

---

## Phase 10: Results & Notifications

**Goal:** Closing the loop with candidates.

### Tasks

1. **Results View**: Candidate lookup (Total score, Ranking)
2. **Ranking Board**: (Admin only) Export capability
3. **Notification Center**:
   - Real-time (contextual) alerts
   - Inbox view for historical notifications
4. Final Responsive testing and PWA manifest (optional)

---

## Tech Stack & Tools

| Category         | Package                             |
|------------------|-------------------------------------|
| Framework        | React 19 + Vite                     |
| Language         | TypeScript                          |
| State Management | Zustand                             |
| Data Fetching    | TanStack Query (v5)                 |
| Forms            | React Hook Form + Zod               |
| Styling          | Tailwind CSS + Lucide Icons         |
| Animation        | Framer Motion                       |
| HTTP Client      | Axios                               |
| Routing          | React Router v7                     |
| Date Formatting  | date-fns                            |
