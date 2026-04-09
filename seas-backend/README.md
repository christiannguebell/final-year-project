# SEAS - Examination System Backend

Saes Examination System (SEAS) is a modular, high-performance backend built with Node.js, Express, and TypeORM. It manages candidate registrations, applications, examinations, and results.

## 🚀 Features

- **Modular Architecture**: Clean separation of concerns with domain-driven modules.
- **Robust Authentication**: JWT-based auth with refresh token support and role-based access control.
- **API Documentation**: Interactive documentation provided by **Scalar** (accessible at `/api/docs`).
- **Security**: Hardened with Helmet, CORS, Rate Limiting, and input sanitization.
- **Health Monitoring**: Integrated health checks for database and other services.
- **Automated Testing**: Comprehensive unit and integration test suite using Jest.

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Documentation**: Scalar / OpenAPI 3.0
- **Testing**: Jest & Supertest
- **Logging**: Winston

## 🚦 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PNPM (recommended) or NPM
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd seas-backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. Run database migrations (if using TypeORM CLI) or let the app sync:
   ```bash
   pnpm dev
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot-reload |
| `pnpm build` | Compile TypeScript to JavaScript |
| `pnpm start` | Run the compiled production server |
| `pnpm test` | Run all tests |
| `pnpm lint` | Run ESLint check |
| `pnpm maildev` | Start local mail server (for email testing) |

## 📖 API Documentation

The API is fully documented using OpenAPI 3.0 specification. You can access the interactive Swagger/Scalar UI at:

`http://localhost:5000/api/docs`

## 📁 Project Structure

```text
src/
├── common/         # Shared utilities, loggers, errors
├── config/         # System-wide configuration
├── database/       # Database connection & migrations
├── middlewares/    # Global Express middlewares
├── modules/        # Domain logic (auth, users, candidates, etc.)
├── routes/         # Central route registry
└── server.ts       # Application entry point
```

## 🛡️ Security

- **Rate Limiting**: Protects against brute-force attacks.
- **Helmet**: Sets secure HTTP headers.
- **CORS**: Configurable cross-origin resource sharing.
- **Sanitization**: Automatic cleaning of user inputs to prevent XSS and injection.

## 📜 License

This project is licensed under the ISC License.
