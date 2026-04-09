# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

COPY . .

# Build TypeScript
RUN pnpm build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install only production dependencies
RUN npm install -g pnpm && pnpm install --prod

# Copy built files
COPY --from=build /app/dist ./dist

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3000

CMD ["node", "dist/server.js"]
