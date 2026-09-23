# Multi-stage build for InterHive Backend
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo package manifests
COPY package.json yarn.lock ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

# Install dependencies (without --frozen-lockfile to allow workspace resolution)
RUN yarn install --production=false --network-timeout 300000

# Copy source code for shared and backend
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
COPY packages/frontend/package.json ./packages/frontend/

RUN yarn install --production=true --network-timeout 300000

# Copy built artifacts from builder
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist

# Set working directory to backend
WORKDIR /app/packages/backend

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]