# Multi-stage build for InterHive Backend

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend

# Build shared package
RUN cd packages/shared && yarn build

# Build backend
RUN cd packages/backend && yarn build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package.json yarn.lock ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/

RUN yarn install --frozen-lockfile --production=true

# Copy built artifacts from builder
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist

# Copy templates
COPY --from=builder /app/packages/backend/templates ./packages/backend/templates

# Copy environment file
COPY packages/backend/.env .env

# Set working directory
WORKDIR /app/packages/backend

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]