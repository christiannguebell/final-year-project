# SEAS — Examination System Backend

SEAS (Student Examination & Admission System) is a modular, high-performance backend built with Node.js, Express, and TypeORM. It manages candidate registrations, applications, examinations, payments, and results.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express.js v5 |
| Language | TypeScript |
| Database | PostgreSQL 15 (via Docker) |
| ORM | TypeORM |
| Auth | JWT (access + refresh tokens) |
| Documentation | Scalar / OpenAPI 3.0 |
| Testing | Jest & Supertest |
| Logging | Winston |

---

## 🗂️ Monorepo Structure

This backend lives inside a monorepo. The database infrastructure is managed at the **root level**, not inside this folder:

```
final-year-project/          ← run docker-compose from HERE
├── docker-compose.yml       ← defines the shared PostgreSQL service
├── .env                     ← Docker / DB credentials
├── db/
│   └── init.sql             ← initial schema (used only on first container creation)
├── seas-backend/            ← YOU ARE HERE (Node.js API)
├── seas-admin/
├── seas-public/
└── seas-admin-portal/
```

> **Important:** Always start the database from the **project root** (`final-year-project/`), not from inside `seas-backend/`.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18.0.0
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for the PostgreSQL container)
- NPM or PNPM

> ⚠️ **Port conflict warning:** If you have another PostgreSQL instance running locally (e.g. for Odoo or another project), it may already occupy port `5432`. The Docker database in this project is mapped to port **`5433`** on the host to avoid conflicts. Make sure nothing else is using port `5433`.

---

### Step 1 — Clone the repository

```bash
git clone <repository-url>
cd final-year-project
```

---

### Step 2 — Configure environment variables

**Root-level** (Docker / DB credentials):
```bash
# Already exists — verify the values are correct
cat .env
```

```env
PORT=3000
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=seas_db
JWT_SECRET=your-super-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
FRONTEND_URL=http://localhost:3001
```

**Backend-level** (API configuration):
```bash
cd seas-backend
cp .env.example .env
```

Key values to confirm in `seas-backend/.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5433        # ← must be 5433 (Docker host port), not 5432
DB_NAME=seas_db
DB_USER=postgres
DB_PASSWORD=postgres
SKIP_EMAIL=true     # set to false once SMTP is configured
```

---

### Step 3 — Install backend dependencies

```bash
cd seas-backend
npm install
```

---

### Step 4 — Start the database

From the **project root** (`final-year-project/`):

```bash
cd ..   # go back to the root if you're inside seas-backend
docker-compose up -d db
```

Verify the container is running:
```bash
docker ps
# You should see: final-year-project-db-1   postgres:15-alpine   Up   0.0.0.0:5433->5432/tcp
```

---

### Step 5 — Seed the database (first time only)

From inside `seas-backend/`:

```bash
npx ts-node -r dotenv/config src/database/seeds/run-seed.ts
```

This will:
- Create all tables (TypeORM auto-sync)
- Insert 6 default academic programs
- Create a default admin user

**Default admin credentials:**
| Field | Value |
|---|---|
| Email | `admin@seas.cm` |
| Password | `Admin@1234` |

> ⚠️ Change the admin password immediately after your first login in production.

---

### Step 6 — Start the development server

From inside `seas-backend/`:

```bash
npm run dev
```

Expected clean output:
```
[INFO]: Validating critical connections...
[INFO]: Database connection verified
[INFO]: Email service skipped (SKIP_EMAIL=true)
[INFO]: Server running on port 3000
```

The API is now running at: **`http://localhost:3000`**

---

## 📖 API Documentation

Interactive API docs (Scalar/OpenAPI) are available once the server is running:

```
http://localhost:3000/api/docs
```

A Postman/Insomnia collection is also included at the root of this folder:
```
SEAS-API-Collection.json
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# With coverage report
npm run test:coverage
```

---

## 📁 Source Structure

```
src/
├── common/         # Shared utilities, logger, error classes
├── config/         # App config, connection validator, Swagger setup
├── database/
│   ├── entities/   # TypeORM entity definitions (one per table)
│   └── seeds/      # Database seed scripts
├── middlewares/    # Global Express middlewares (auth, error handler, upload)
├── modules/        # Domain modules (auth, users, applications, payments, etc.)
├── routes/         # Central route registry
├── services/       # Shared services (email, file upload)
├── templates/      # Email HTML templates (Handlebars)
└── server.ts       # Application entry point
```

---

## 📧 Email Service

Email is disabled by default (`SKIP_EMAIL=true` in `.env`). To enable it:

1. Set up an SMTP provider (or run `npm run maildev` for a local test mail server)
2. Update `seas-backend/.env`:
   ```env
   SKIP_EMAIL=false
   SMTP_HOST=localhost
   SMTP_PORT=1025
   SMTP_SECURE=false
   EMAIL_FROM=noreply@seas-exam.local
   ```
3. Restart the server

---

## 🛡️ Security Features

- **JWT Auth** — access tokens (7d) + refresh tokens (30d) with token versioning
- **Rate Limiting** — protects against brute-force attacks
- **Helmet** — sets secure HTTP response headers
- **CORS** — configurable allowed origins via `CORS_ORIGIN` env variable
- **Input Validation** — via `express-validator` and `joi`

---

## 🔄 Daily Development Workflow

```bash
# 1. Start DB (from project root)
docker-compose up -d db

# 2. Start backend (from seas-backend/)
npm run dev

# 3. When done — stop the DB container
docker-compose stop db
```

---

## 📜 License

This project is licensed under the ISC License.
