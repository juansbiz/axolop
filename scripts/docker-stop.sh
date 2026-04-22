#!/bin/bash

# ==============================================================================
# Axolop CRM - Docker Backend Stop Script
# ==============================================================================
# Gracefully stops axolop-backend and axolop-redis containers.
# ==============================================================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Stopping Axolop CRM Docker Backend ===${NC}"

cd docker/backend

# Stop containers
docker-compose down

echo ""
echo -e "${GREEN}✅ Docker containers stopped and removed.${NC}"
echo -e "${YELLOW}Note: Redis data is persisted in the 'redis-data' volume.${NC}"
