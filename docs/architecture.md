# SEAS Examination System Backend
## Modular Monolithic Architecture
### Node.js + Express + PostgreSQL

---

# 1. ARCHITECTURE OVERVIEW

This backend uses a Modular Monolithic Architecture.

Characteristics:
- Single deployable application
- Single PostgreSQL database
- Feature-based modules
- Strict separation of concerns
- Modules communicate via services (NOT direct DB access)
- Clear boundaries for future microservice extraction

Core architectural principles:
- Controllers handle HTTP only
- Services handle business logic
- Repositories handle database access
- Middlewares handle cross-cutting concerns
- No circular dependencies between modules

---

# 2. PROJECT STRUCTURE

seas-backend/
│
├── src/
│   ├── server.js
│   ├── app.js
│   │
│   ├── config/
│   ├── database/
│   ├── common/
│   ├── middlewares/
│   ├── routes/
│   └── modules/
│
├── tests/
├── uploads/
├── .env
├── package.json
└── README.md

---

# 3. ENTRY LAYER

src/server.js
Responsibilities:
- Load environment variables
- Start Express server
- Setup graceful shutdown
- Listen on configured port

No business logic allowed here.

src/app.js
Responsibilities:
- Initialize Express app
- Register global middlewares
- Register routes
- Setup centralized error handling

---

# 4. CONFIGURATION LAYER

Location: src/config/

Files:

env.js
- Loads and validates environment variables.

app.config.js
- Application constants (token expiry, pagination defaults, upload size limits).

roles.js
Defines system roles:
CANDIDATE
ADMIN
EXAMINER

Rule:
Configuration must never be hardcoded inside modules.

---

# 5. DATABASE LAYER

Location: src/database/

Structure:

database/
- postgres.js
- index.js
- migrations/
- seeders/

Responsibilities:
- Initialize PostgreSQL connection
- Export query client
- Handle transactions
- Manage migrations

Rules:
- Only repositories can access the database.
- Controllers and services must not execute raw SQL directly.
- Transactions are handled at service layer when required.

---

# 6. COMMON SHARED LAYER

Location: src/common/

Structure:

common/
- utils/
- errors/
- validators/
- constants/
- logger/

Responsibilities:

utils/
- ID generation
- Date helpers
- Pagination helpers

errors/
- ApiError
- ValidationError
- UnauthorizedError
- NotFoundError

validators/
- Reusable validation schemas

constants/
- Enums
- System-wide constants

logger/
- Central logging configuration (Winston or Pino)

Rule:
Only generic reusable logic belongs here. No business logic.

---

# 7. GLOBAL MIDDLEWARES

Location: src/middlewares/

Files:

auth.middleware.js
- Verifies JWT
- Attaches user object to request

role.middleware.js
- Authorizes access based on role

validation.middleware.js
- Validates request body/params

upload.middleware.js
- Handles file uploads using Multer

error.middleware.js
- Centralized error handler

Rules:
- Middlewares must be stateless.
- No business logic in middleware.
- Error middleware must be registered last.

---

# 8. ROUTE REGISTRY

Location: src/routes/index.js

Responsibilities:
- Aggregate all module routes
- Prefix routes appropriately

Example:
- /api/auth
- /api/users
- /api/candidates
- /api/applications
- /api/documents
- /api/payments
- /api/exams
- /api/results
- /api/notifications

Rule:
Modules expose their router. Route registration happens centrally.

---

# 9. MODULE STRUCTURE (MODULAR MONOLITH CORE)

Location: src/modules/

Each feature module follows the same internal structure:

modules/
  module-name/
    module-name.controller.js
    module-name.service.js
    module-name.repository.js
    module-name.routes.js
    module-name.validation.js
    module-name.constants.js
    index.js

---

# 10. MODULE RESPONSIBILITIES

CONTROLLER
- Handles HTTP requests
- Extracts request data
- Calls service methods
- Returns formatted response
- No database logic

SERVICE
- Contains business logic
- Coordinates multiple repositories if needed
- Handles transactions
- Enforces domain rules

REPOSITORY
- Contains database queries
- Uses PostgreSQL client
- No business logic

VALIDATION
- Defines request validation schemas

CONSTANTS
- Module-specific enums or statuses

INDEX
- Exports module components

---

# 11. SYSTEM MODULES

auth/
- Login
- Register
- JWT handling
- Password hashing
- Token refresh

users/
- User CRUD
- Admin management
- Account activation/deactivation

candidates/
- Candidate profile management
- Candidate number generation

applications/
- Create application
- Update draft
- Submit
- Approve/Reject

documents/
- Upload files
- Verify documents
- Replace documents

payments/
- Upload receipt
- Verify payment
- Track status

exams/
- Create exam sessions
- Create exam centers
- Assign candidates to centers
- Generate exam slips

results/
- Enter scores
- Calculate totals
- Rank candidates
- Publish results

notifications/
- Create system notifications
- Mark as read

---

# 12. UPLOADS DIRECTORY

Location: uploads/

Structure:

uploads/
- documents/
- receipts/
- profile_photos/

Rules:
- Files stored with unique names
- No direct public access
- Access controlled through routes

---

# 13. TESTING STRUCTURE

Location: tests/

Structure:

tests/
- unit/
- integration/

Unit Tests:
- Services
- Utilities

Integration Tests:
- API endpoints
- Authentication flow

---

# 14. DEVELOPMENT RULES

1. Controllers must stay thin.
2. Services must enforce business rules.
3. Repositories must only talk to DB.
4. No module should access another module’s repository directly.
5. Inter-module communication must happen through services.
6. Use dependency injection pattern where possible.
7. Use transactions for multi-step operations.
8. Never expose raw database errors to clients.
9. Always validate incoming data.
10. Maintain consistent response format.

---

# 15. RESPONSE FORMAT STANDARD

Success:

{
  success: true,
  message: "Operation successful",
  data: {}
}

Error:

{
  success: false,
  message: "Error message",
  errors: []
}

---

# 16. FUTURE SCALABILITY

This modular monolith can evolve into microservices by extracting:

- Auth Service
- Payment Service
- Exam Service
- Notification Service

Each module already has clear boundaries to support extraction.

---

# 17. SUMMARY

This architecture ensures:

- Clean separation of concerns
- Maintainable codebase
- Scalable domain boundaries
- Testable modules
- Secure structure
- Production readiness

The system is structured to support thousands of candidates and multiple exam sessions while remaining easy to extend and maintain.