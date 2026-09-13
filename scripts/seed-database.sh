#!/bin/bash
set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🌱 Seeding Database...${NC}"

if ! mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
    echo -e "${RED}❌ MongoDB is not running.${NC}"
    exit 1
fi

if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

cd packages/backend
yarn seed

echo -e "${GREEN}✅ Database seeding complete!${NC}"