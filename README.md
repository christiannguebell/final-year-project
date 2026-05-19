# SEAS - Student/Student Examination Administration System

A full-stack examination management system for student admissions and academic assessments. The system consists of three main components: backend API, admin portal, and public-facing web application.

## Project Structure

```
seas concour system/
├── docker-compose.yml    # Docker orchestration for production
├── seas-backend/        # Node.js/Express API
├── seas-admin/          # React admin dashboard
└── seas-public/        # React public website
```

## Prerequisites

- **Node.js** >= 18.0.0
- **PNPM** (recommended) or NPM
- **PostgreSQL** 15+ (for local development)
- **Docker** & Docker Compose (optional, for containerized setup)

> **Note**: Maildev is used to capture emails locally during development. The backend sends emails to Maildev SMTP (localhost:1025), and you can view them at `http://localhost:1080`.
>
> If you don't have maildev installed globally:
> ```bash
> npm install -g maildev
> ```

## Quick Start

### Option 1: Local Development

1. **Clone and navigate to the project:**
   ```bash
   cd seas-concour-system
   ```

2. **Set up the backend:**
   ```bash
   cd seas-backend
   cp .env.example .env
   # Edit .env with your database credentials
   pnpm install
   ```

3. **Set up the admin portal:**
   ```bash
   cd ../seas-admin
   pnpm install
   ```

4. **Set up the public website:**
   ```bash
   cd ../seas-public
   pnpm install
   ```

5. **Start PostgreSQL** (ensure it's running locally)

6. **Run all applications:**
   ```bash
   # Terminal 1 - Maildev (catches emails locally, port 1080)
   cd seas-backend && pnpm maildev

   # Terminal 2 - Backend (port 3000)
   cd seas-backend && pnpm dev

   # Terminal 3 - Admin (port 3001)
   cd seas-admin && pnpm dev

   # Terminal 4 - Public (port 3002)
   cd seas-public && pnpm dev
   ```

   **Maildev** catches all emails sent by the application locally. View captured emails at: `http://localhost:1080`

### Option 2: Docker (Backend + Database Only)

```bash
# Create .env file in seas-backend before running
cp seas-backend/.env.example seas-backend/.env

# Start services
docker-compose up -d
```

## Environment Variables

### Backend (`seas-backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `seas_db` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_REFRESH_SECRET` | Refresh token secret | - |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3001` |
| `SMTP_HOST` | Email SMTP host | `localhost` |
| `SMTP_PORT` | Email SMTP port | `1025` |

### Frontend (via environment variables)

Both `seas-admin` and `seas-public` use:
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3000/api` |
| `VITE_APP_NAME` | Application name | - |

Set these when running the dev server:
```bash
VITE_API_BASE_URL=http://localhost:3000/api pnpm dev
```

## Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (hot reload) |
| `pnpm build` | Build for production |
| `pnpm start` | Run production server |
| `pnpm test` | Run tests |
| `pnpm lint` | Run ESLint |
| `pnpm maildev` | Start local mail testing server |

### Admin & Public Frontends

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Preview production build |

## API Documentation

When the backend is running, visit: `http://localhost:3000/api/docs`

## Tech Stack

- **Backend**: Node.js, Express, TypeORM, PostgreSQL, JWT
- **Admin/Public**: React 19, Vite, TypeScript, Tailwind CSS, Zustand
- **Testing**: Jest, Vitest, Playwright

## License

ISC
https://stitch.withgoogle.com/projects/10129977464472887448