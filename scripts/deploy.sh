#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting InterHive Deployment...${NC}"

if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
fi

VERSION=${VERSION:-$(git rev-parse --short HEAD)}
echo -e "${YELLOW}Using version: $VERSION${NC}"

# Build Docker images
echo -e "${GREEN}📦 Building Docker images...${NC}"
docker build -t interhive/backend:$VERSION -f packages/backend/Dockerfile .
docker build -t interhive/frontend:$VERSION -f packages/frontend/Dockerfile .

# Push to registry
if [ ! -z "$DOCKER_REGISTRY" ]; then
    echo -e "${GREEN}📤 Pushing images to registry...${NC}"
    docker tag interhive/backend:$VERSION $DOCKER_REGISTRY/interhive/backend:$VERSION
    docker tag interhive/frontend:$VERSION $DOCKER_REGISTRY/interhive/frontend:$VERSION
    docker push $DOCKER_REGISTRY/interhive/backend:$VERSION
    docker push $DOCKER_REGISTRY/interhive/frontend:$VERSION
fi

# Deploy to Kubernetes
echo -e "${GREEN}☸️ Deploying to Kubernetes...${NC}"
kubectl apply -f infrastructure/kubernetes/

# Wait for deployment
echo -e "${GREEN}⏳ Waiting for deployment...${NC}"
kubectl rollout status deployment/interhive-backend -n interhive
kubectl rollout status deployment/interhive-frontend -n interhive

# Run migrations
echo -e "${GREEN}🗄️ Running database migrations...${NC}"
kubectl exec -it deployment/interhive-backend -n interhive -- yarn migrate

# Seed database
if [ "$SEED_DATABASE" = "true" ]; then
    echo -e "${GREEN}🌱 Seeding database...${NC}"
    kubectl exec -it deployment/interhive-backend -n interhive -- yarn seed
fi

echo -e "${GREEN}✅ Deployment complete!${NC}"