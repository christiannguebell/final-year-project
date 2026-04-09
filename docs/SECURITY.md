# Security Hardening - SEAS Backend

This document outlines the security measures implemented in the SEAS backend.

## 1. Rate Limiting
- **Global Limiter**: Applied to all `/api` routes. Limits the number of requests per window (configured in `.env`).
- **Auth Limiter**: Applied to all `/api/auth` routes. Stricter limits to prevent brute-force attacks on login and registration.
- **Upload Limiter**: Applied to file upload endpoints to prevent Denial of Service (DoS) via large or frequent uploads.

## 2. Input Sanitization
- All incoming requests (`req.body`, `req.query`, `req.params`) are sanitized to remove dangerous HTML patterns and potential Cross-Site Scripting (XSS) payloads using `sanitizeInput` middleware.

## 3. Security Headers
- **Helmet**: Used to set various HTTP headers for security (CSP, HSTS, etc.).
- **CORS**: Configured with a whitelist of allowed origins (configured in `.env`).

## 4. SQL Injection Prevention
- **TypeORM**: Used for all database interactions. It uses parameterized queries by default, protecting against SQL injection.

## 5. File Upload Security
- **Type Validation**: Only allowed MIME types (JPEG, PNG, GIF, PDF, DOC, DOCX) are accepted.
- **Size Limits**: Maximum file size is enforced via Multer configuration.
- **Filename Sanitization**: Files are renamed with a unique suffix to prevent path traversal and filename collisions.

## 6. Audit Logging
- **Admin Actions**: All administrative actions (CREATE, UPDATE, DELETE, VERIFY, PUBLISH, ASSIGN) are logged in `logs/audit/audit.log`.
- **Log Details**: Each entry includes timestamp, action, user ID, user role, target type, target ID, IP address, and user agent.

## 7. JWT Security & Rotation
- **Secret Management**: JWT secrets are stored as environment variables (`JWT_SECRET`, `JWT_REFRESH_SECRET`).
- **Expiration**: Short-lived access tokens and longer-lived refresh tokens are used.
- **Rotation Strategy**:
  - In production, rotate secrets periodically.
  - When a secret is rotated, all existing tokens signed with the old secret will become invalid, effectively logging out all users.
  - For zero-downtime rotation, the `authenticate` middleware could be updated to support a list of valid secrets (current and previous), but for simple deployments, environmental rotation is sufficient.

## 8. Reverse Proxy Configuration
- `app.set('trust proxy', 1)` is enabled in production to ensure that rate limiting correctly identifies the client's IP address when behind a reverse proxy (e.g., Nginx, Cloudflare).
