# DevOps & CI/CD - SEAS Backend

This document describes the deployment and automation setup for the SEAS backend.

## 1. Containerization
- **Dockerfile**: A multi-stage Docker build is provided to create a lightweight production image.
- **Docker Compose**: A `docker-compose.yml` file in the root directory manages the backend application and a PostgreSQL 15 database.

## 2. CI/CD Pipelines (GitHub Actions)
- **CI (`ci.yml`)**: Triggered on every push or pull request to `main` and `develop` branches.
  - Validates code with ESLint.
  - Runs unit and integration tests (using a temporary PostgreSQL service in the runner).
  - Performs a build check to ensure TypeScript compiles correctly.
- **CD (`cd.yml`)**: Triggered on every push to the `main` branch.
  - Builds the Docker image.
  - (Template) Pushes to a container registry and deploys to a server.

## 3. Required GitHub Secrets
To fully enable the CD pipeline, the following secrets should be configured in the GitHub repository:
- `DOCKERHUB_USERNAME`: Your Docker Hub username.
- `DOCKERHUB_TOKEN`: A Docker Hub personal access token.
- `DB_USER`: Database user for the app service.
- `DB_PASSWORD`: Database password for the app service.
- `DB_NAME`: Database name for the app service.
- `JWT_SECRET`: Secret key for JWT signing.
- `JWT_REFRESH_SECRET`: Secret key for JWT refresh tokens.

## 4. Local Deployment with Docker
To run the entire system locally using Docker:
```bash
docker-compose up --build
```
Ensure you have a `.env` file in the root directory or variables exported in your shell as defined in `docker-compose.yml`.

## 5. Health Checks & Graceful Shutdown
- **Health Check**: Available at `GET /api/health`. It verifies the database connection status.
- **Graceful Shutdown**: The server handles `SIGTERM` and `SIGINT` signals by:
  1. Closing the HTTP server (no new requests accepted).
  2. Closing the database connection.
  3. Exiting the process with a success code.
  4. Forcefully shutting down after 10 seconds if connections are still hanging.
