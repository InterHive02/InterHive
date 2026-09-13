#!/bin/bash
set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}💾 Creating database backup...${NC}"

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/interhive_$TIMESTAMP.gz"
RETENTION_DAYS=30

if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

mkdir -p $BACKUP_DIR

if [ ! -z "$MONGODB_URI" ]; then
    mongodump --uri="$MONGODB_URI" --archive="$BACKUP_FILE" --gzip
else
    echo -e "${RED}❌ MONGODB_URI not set${NC}"
    exit 1
fi

find $BACKUP_DIR -name "interhive_*.gz" -mtime +$RETENTION_DAYS -delete
echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"