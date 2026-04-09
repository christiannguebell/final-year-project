# SEAS Examination System — Development Plan

> Modular Monolith | Node.js + Express + PostgreSQL

---

## Phase 1: Project Setup & Foundation

**Goal:** Scaffold project, install dependencies, configure tooling.

### Tasks

1. Initialize Node.js project (`npm init`)
2. Install core dependencies
   - `express` — HTTP framework
   - `pg` / `typeorm` — PostgreSQL client & query builder
   - `dotenv` — env variable loading
   - `winston` — logging
   - `cors`, `helmet` — security middlewares
3. Install dev dependencies
   - `nodemon` — hot reload
   - `jest` / `supertest` — testing
   - `eslint` + `prettier` — linting & formatting
4. Create folder structure
5. Configure `.env` and `.env.example`
6. Setup ESLint + Prettier configs
7. Setup `package.json` scripts (`dev`, `start`, `test`, `lint`)

### Folder Structure

```
seas-backend/
├── src/
│   ├── server.js
│   ├── app.js
│   ├── config/
│   │   ├── env.js
│   │   ├── app.config.js
│   │   └── roles.js
│   ├── database/
│   │   ├── postgres.js
│   │   ├── index.js
│   │   ├── migrations/
│   │   └── seeders/
│   ├── common/
│   │   ├── utils/
│   │   ├── errors/
│   │   ├── validators/
│   │   ├── constants/
│   │   └── logger/
│   ├── middlewares/
│   ├── routes/
│   └── modules/
├── tests/
│   ├── unit/
│   └── integration/
├── uploads/
├── .env
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── knexfile.js
├── package.json
└── README.md
```

### Tools & Dependencies

| Category     | Package           |
|-------------|-------------------|
| Framework    | express           |
| Database     | pg, knex          |
| Auth         | bcrypt, jsonwebtoken |
| Validation   | joi / zod         |
| Upload       | multer            |
| Logging      | winston           |
| Security     | helmet, cors      |
| Testing      | jest, supertest   |
| Dev tools    | nodemon, eslint, prettier |

---

## Phase 2: Database Layer

**Goal:** Define schema, migrations, seed data, DB connection.

### Tasks

1. Configure Knex connection (`knexfile.js`)
2. Create DB connection module (`database/postgres.js`)
3. Create migration for all 12 entities:
   - `users`
   - `candidate_profiles`
   - `programs`
   - `applications`
   - `academic_records`
   - `documents`
   - `payments`
   - `exam_sessions`
   - `exam_centers`
   - `exam_assignments`
   - `results`
   - `result_scores`
   - `notifications`
4. Define enums as PostgreSQL custom types
5. Set up foreign keys and indexes
6. Create seeders for roles, programs, admin user
7. Test DB connection and migrations

### Files Created

```
database/
├── postgres.js              # Pool connection
├── index.js                 # Export client
├── migrations/
│   ├── 001_create_users.js
│   ├── 002_create_candidate_profiles.js
│   ├── 003_create_programs.js
│   ├── 004_create_applications.js
│   ├── 005_create_academic_records.js
│   ├── 006_create_documents.js
│   ├── 007_create_payments.js
│   ├── 008_create_exam_sessions.js
│   ├── 009_create_exam_centers.js
│   ├── 010_create_exam_assignments.js
│   ├── 011_create_results.js
│   ├── 012_create_result_scores.js
│   └── 013_create_notifications.js
└── seeders/
    ├── 001_seed_roles_admin.js
    └── 002_seed_programs.js
```

---

## Phase 3: Common Shared Layer

**Goal:** Build reusable utilities, error classes, logger, constants.

### Tasks

1. Setup Winston logger with transports (console, file)
2. Create custom error classes:
   - `ApiError`
   - `ValidationError`
   - `UnauthorizedError`
   - `NotFoundError`
3. Build utility helpers:
   - ID generation (uuid)
   - Date helpers
   - Pagination helper
4. Define system-wide constants/enums
5. Create reusable validation schemas (Joi/Zod)
6. Build standardized response formatter

### Files Created

```
common/
├── utils/
│   ├── idGenerator.js
│   ├── dateHelper.js
│   ├── pagination.js
│   └── responseFormatter.js
├── errors/
│   ├── ApiError.js
│   ├── ValidationError.js
│   ├── UnauthorizedError.js
│   ├── NotFoundError.js
│   └── index.js
├── validators/
│   └── schemas.js
├── constants/
│   └── enums.js
└── logger/
    └── index.js
```

---

## Phase 4: Global Middlewares

**Goal:** Implement cross-cutting concerns (auth, validation, error handling, uploads).

### Tasks

1. `auth.middleware.js` — JWT verification, attach `req.user`
2. `role.middleware.js` — Role-based access guard
3. `validation.middleware.js` — Request body/params validation
4. `upload.middleware.js` — Multer config for file uploads
5. `error.middleware.js` — Centralized error handler
6. Register middlewares in `app.js`

### Files Created

```
middlewares/
├── auth.middleware.js
├── role.middleware.js
├── validation.middleware.js
├── upload.middleware.js
└── error.middleware.js
```

---

## Phase 5: Auth Module

**Goal:** Registration, login, JWT, password management.

### Tasks

1. Build auth service (register, login, token refresh)
2. Password hashing with bcrypt
3. JWT token generation & verification
4. Forgot/reset password flow
5. Create auth routes
6. Create auth validation schemas
7. Unit test auth service
8. Integration test auth endpoints

### Files Created

```
modules/auth/
├── auth.controller.js
├── auth.service.js
├── auth.repository.js
├── auth.routes.js
├── auth.validation.js
├── auth.constants.js
└── index.js
```

### Routes

| Method | Endpoint                | Access  |
|--------|------------------------|---------|
| POST   | /api/auth/register      | Public  |
| POST   | /api/auth/login         | Public  |
| POST   | /api/auth/refresh-token | Public  |
| POST   | /api/auth/forgot-password | Public |
| POST   | /api/auth/reset-password | Public |
| PUT    | /api/auth/change-password | Auth  |

---

## Phase 6: Users Module

**Goal:** User CRUD, admin management, account activation.

### Tasks

1. User repository (CRUD queries)
2. User service (business logic)
3. User controller (HTTP handlers)
4. Admin: list, search, activate/deactivate users
5. User routes + validation
6. Unit + integration tests

### Files Created

```
modules/users/
├── users.controller.js
├── users.service.js
├── users.repository.js
├── users.routes.js
├── users.validation.js
├── users.constants.js
└── index.js
```

### Routes

| Method | Endpoint             | Access      |
|--------|---------------------|-------------|
| GET    | /api/users           | Admin       |
| GET    | /api/users/:id       | Admin/Auth  |
| PUT    | /api/users/:id       | Admin/Auth  |
| PATCH  | /api/users/:id/activate | Admin    |
| PATCH  | /api/users/:id/deactivate | Admin  |

---

## Phase 7: Candidates Module

**Goal:** Candidate profile CRUD, candidate number generation.

### Tasks

1. Candidate repository
2. Candidate service (auto-generate candidate number)
3. Candidate controller
4. Profile photo upload support
5. Candidate routes + validation
6. Tests

### Files Created

```
modules/candidates/
├── candidates.controller.js
├── candidates.service.js
├── candidates.repository.js
├── candidates.routes.js
├── candidates.validation.js
├── candidates.constants.js
└── index.js
```

---

## Phase 8: Programs Module

**Goal:** Program CRUD for admins.

### Tasks

1. Program repository
2. Program service
3. Program controller
4. Activate/deactivate programs
5. Routes + validation
6. Tests

### Files Created

```
modules/programs/
├── programs.controller.js
├── programs.service.js
├── programs.repository.js
├── programs.routes.js
├── programs.validation.js
├── programs.constants.js
└── index.js
```

---

## Phase 9: Applications Module

**Goal:** Create, edit, submit, approve/reject applications.

### Tasks

1. Application repository
2. Application service (status workflow: DRAFT → SUBMITTED → APPROVED/REJECTED)
3. Academic records sub-module (linked to application)
4. Application controller
5. Admin review & approval flow
6. Routes + validation
7. Tests

### Files Created

```
modules/applications/
├── applications.controller.js
├── applications.service.js
├── applications.repository.js
├── applications.routes.js
├── applications.validation.js
├── applications.constants.js
└── index.js
```

### Routes

| Method | Endpoint                         | Access          |
|--------|----------------------------------|-----------------|
| POST   | /api/applications                | Candidate       |
| GET    | /api/applications/mine           | Candidate       |
| GET    | /api/applications/:id            | Candidate/Admin |
| PUT    | /api/applications/:id            | Candidate       |
| POST   | /api/applications/:id/submit     | Candidate       |
| PATCH  | /api/applications/:id/approve    | Admin           |
| PATCH  | /api/applications/:id/reject     | Admin           |
| GET    | /api/applications                | Admin           |

---

## Phase 10: Documents Module

**Goal:** Upload, verify, replace application documents.

### Tasks

1. Document repository
2. Document service (file validation, storage)
3. Document controller
4. Admin verification flow
5. Multer integration for uploads
6. Routes + validation
7. Tests

### Files Created

```
modules/documents/
├── documents.controller.js
├── documents.service.js
├── documents.repository.js
├── documents.routes.js
├── documents.validation.js
├── documents.constants.js
└── index.js
```

### Upload Directories

```
uploads/
├── documents/
├── receipts/
└── profile_photos/
```

---

## Phase 11: Payments Module

**Goal:** Receipt upload, payment verification, status tracking.

### Tasks

1. Payment repository
2. Payment service
3. Payment controller
4. Admin verification (approve/reject)
5. Receipt file upload
6. Routes + validation
7. Tests

### Files Created

```
modules/payments/
├── payments.controller.js
├── payments.service.js
├── payments.repository.js
├── payments.routes.js
├── payments.validation.js
├── payments.constants.js
└── index.js
```

---

## Phase 12: Exams Module

**Goal:** Exam sessions, centers, candidate assignments, exam slip generation.

### Tasks

1. Exam session repository + service + controller
2. Exam center repository + service + controller
3. Exam assignment logic (allocate candidates to centers)
4. Seat number assignment
5. PDF exam slip generation (`pdfkit` or `puppeteer`)
6. Routes + validation
7. Tests

### Files Created

```
modules/exams/
├── exams.controller.js
├── exams.service.js
├── exams.repository.js
├── exams.routes.js
├── exams.validation.js
├── exams.constants.js
└── index.js
```

### Additional Dependency

- `pdfkit` — PDF generation for exam slips

### Routes

| Method | Endpoint                         | Access    |
|--------|----------------------------------|-----------|
| POST   | /api/exams/sessions              | Admin     |
| GET    | /api/exams/sessions              | Admin     |
| POST   | /api/exams/centers               | Admin     |
| GET    | /api/exams/centers               | Admin     |
| POST   | /api/exams/assign                | Admin     |
| GET    | /api/exams/my-assignment         | Candidate |
| GET    | /api/exams/slip/:applicationId   | Candidate |

---

## Phase 13: Results Module

**Goal:** Score entry, ranking, result publication.

### Tasks

1. Result repository + service + controller
2. Result scores sub-module (subject-level marks)
3. Auto-calculate total scores
4. Auto-rank candidates
5. Bulk result upload support
6. Publish/unpublish results
7. Routes + validation
8. Tests

### Files Created

```
modules/results/
├── results.controller.js
├── results.service.js
├── results.repository.js
├── results.routes.js
├── results.validation.js
├── results.constants.js
└── index.js
```

### Routes

| Method | Endpoint                      | Access      |
|--------|-------------------------------|-------------|
| POST   | /api/results/enter            | Admin       |
| POST   | /api/results/bulk-upload      | Admin       |
| GET    | /api/results                  | Admin       |
| GET    | /api/results/my-result        | Candidate   |
| POST   | /api/results/publish          | Admin       |
| GET    | /api/results/ranking          | Admin       |

---

## Phase 14: Notifications Module

**Goal:** System notifications, mark as read.

### Tasks

1. Notification repository + service + controller
2. Trigger notifications on key events:
   - Application approved/rejected
   - Payment verified
   - Exam scheduled
   - Results published
3. Mark as read
4. Routes + validation
5. Tests

### Files Created

```
modules/notifications/
├── notifications.controller.js
├── notifications.service.js
├── notifications.repository.js
├── notifications.routes.js
├── notifications.validation.js
├── notifications.constants.js
└── index.js
```

---

## Phase 15: Route Registry & Integration [COMPLETED]

**Goal:** Wire all modules into the Express app.

### Tasks

1. Create `routes/index.js` — aggregate all module routers
2. Register route prefixes:
   - `/api/auth`
   - `/api/users`
   - `/api/candidates`
   - `/api/applications`
   - `/api/documents`
   - `/api/payments`
   - `/api/exams`
   - `/api/results`
   - `/api/notifications`
3. Register middlewares in `app.js` (correct order)
4. Verify all endpoints respond correctly
5. End-to-end smoke tests

### Files Created

```
routes/
└── index.js
```

---

## Phase 16: Testing & Quality Assurance

**Goal:** Comprehensive test coverage.

### Tasks

1. Unit tests for all services
2. Unit tests for utilities and helpers
3. Integration tests for all API endpoints
4. Auth flow integration tests
5. File upload tests
6. Error handling tests
7. Achieve >80% code coverage

### Test Structure

```
tests/
├── unit/
│   ├── services/
│   │   ├── auth.service.test.js
│   │   ├── users.service.test.js
│   │   ├── candidates.service.test.js
│   │   ├── applications.service.test.js
│   │   ├── documents.service.test.js
│   │   ├── payments.service.test.js
│   │   ├── exams.service.test.js
│   │   ├── results.service.test.js
│   │   └── notifications.service.test.js
│   └── utils/
│       ├── idGenerator.test.js
│       ├── pagination.test.js
│       └── responseFormatter.test.js
├── integration/
│   ├── auth.test.js
│   ├── users.test.js
│   ├── candidates.test.js
│   ├── applications.test.js
│   ├── documents.test.js
│   ├── payments.test.js
│   ├── exams.test.js
│   ├── results.test.js
│   └── notifications.test.js
└── setup.js
```

### Commands

```bash
npm test               # Run all tests
npm run test:unit      # Unit tests only
npm run test:integration  # Integration tests only
npm run test:coverage  # Coverage report
```

---

## Phase 17: Security Hardening [COMPLETED]


**Goal:** Production-grade security.

### Tasks

1. Rate limiting (`express-rate-limit`)
2. Input sanitization (`express-mongo-sanitize` / custom)
3. CORS whitelist configuration
4. Helmet security headers
5. JWT secret rotation strategy
6. File upload validation (type, size, name)
7. SQL injection prevention (parameterized queries)
8. Audit logging for admin actions

### Additional Dependencies

- `express-rate-limit`

---

## Phase 18: DevOps & CI/CD [COMPLETED]


**Goal:** Automated pipelines, containerization, deployment.

### Tasks

1. Create `Dockerfile`
2. Create `docker-compose.yml` (app + PostgreSQL)
3. Create `.dockerignore`
4. Setup GitHub Actions workflows:
   - **CI:** lint, test, build on PR
   - **CD:** deploy on merge to main
5. Configure environment secrets in GitHub
6. Add health check endpoint (`GET /api/health`)
7. Add graceful shutdown handling in `server.js`

### Files Created

```
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
└── .github/
    └── workflows/
        ├── ci.yml
        └── cd.yml
```

### GitHub Actions — CI (`ci.yml`)

```yaml
Triggers: push, pull_request
Steps:
  - Checkout code
  - Setup Node.js
  - Install dependencies
  - Run linter
  - Run tests with coverage
  - Build check
```

### GitHub Actions — CD (`cd.yml`)

```yaml
Triggers: push to main
Steps:
  - Checkout code
  - Build Docker image
  - Push to registry
  - Deploy to server
```

---

## Phase 19: Documentation & Finalization

**Goal:** API docs, README, handoff-ready codebase.

### Tasks

1. Generate API documentation (Swagger / `swagger-jsdoc` + `swagger-ui-express`)
2. Write `README.md`:
   - Project overview
   - Setup instructions
   - Environment variables
   - API endpoints
   - Architecture diagram
3. Document all environment variables in `.env.example`
4. Final code review & cleanup
5. Remove dead code, unused imports
6. Verify all scripts work

### Additional Dependencies

- `swagger-jsdoc`
- `swagger-ui-express`

### Files Created

```
├── README.md
├── .env.example
└── docs/
    └── swagger.json
```

---

## Development Order Summary

| Phase | Focus                  | Duration Est. |
|-------|------------------------|---------------|
| 1     | Project Setup          | 1 day         |
| 2     | Database Layer         | 2 days        |
| 3     | Common Shared Layer    | 1 day         |
| 4     | Global Middlewares     | 1 day         |
| 5     | Auth Module            | 2 days        |
| 6     | Users Module           | 1 day         |
| 7     | Candidates Module      | 1 day         |
| 8     | Programs Module        | 0.5 day       |
| 9     | Applications Module    | 2 days        |
| 10    | Documents Module       | 1 day         |
| 11    | Payments Module        | 1 day         |
| 12    | Exams Module           | 2 days        |
| 13    | Results Module         | 2 days        |
| 14    | Notifications Module   | 1 day         |
| 15    | Route Registry         | 0.5 day       |
| 16    | Testing & QA           | 3 days        |
| 17    | Security Hardening     | 1 day         |
| 18    | DevOps & CI/CD         | 1.5 days      |
| 19    | Documentation          | 1 day         |
| **Total** |                     | **~25 days**  |

---

## Module Contract (Applied to Every Module)

```
module-name/
├── module-name.controller.js    # HTTP handlers only
├── module-name.service.js       # Business logic
├── module-name.repository.js    # DB queries only
├── module-name.routes.js        # Route definitions
├── module-name.validation.js    # Request schemas (Joi/Zod)
├── module-name.constants.js     # Module enums/statuses
└── index.js                     # Export router
```

**Golden Rules:**
- Controllers never touch DB
- Repositories never contain logic
- Modules never access other modules' repositories
- Inter-module calls go through services
- All responses use `{ success, message, data/errors }` format
