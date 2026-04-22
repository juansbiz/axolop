#!/bin/bash

# ==============================================================================
# Axolop CRM - Docker Backend Start Script
# ==============================================================================
# This script prepares the environment and starts the backend in Docker containers.
# It handles:
# 1. Checking for Docker installation
# 2. Killing any existing local process on port 3002
# 3. Setting up Docker environment variables
# 4. Starting the containers
# ==============================================================================

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Ensure standard paths are available
export PATH=$PATH:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin

# Determine Docker Compose command
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}Error: Neither 'docker compose' nor 'docker-compose' found.${NC}"
    exit 1
fi

echo -e "${GREEN}=== Axolop CRM Docker Backend Launcher ===${NC}"
echo ""

# 1. Check for Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed or not in PATH.${NC}"
    echo "Please install Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker daemon is not running or not accessible.${NC}"
    echo "Debug info:"
    echo "DOCKER_HOST: $DOCKER_HOST"
    docker context ls
    
    # Try standard socket if default check fails
    if [ -S "/var/run/docker.sock" ]; then
         echo -e "${YELLOW}Found /var/run/docker.sock, attempting to use it...${NC}"
         export DOCKER_HOST="unix:///var/run/docker.sock"
         if docker info &> /dev/null; then
             echo -e "${GREEN}Connected via socket override.${NC}"
         else
             echo -e "${RED}Still cannot connect.${NC}"
             exit 1
         fi
    else
         echo "Please start Docker Desktop and try again."
         exit 1
    fi
fi

# 2. Kill local process on port 3002
echo -e "${YELLOW}Checking for conflicting processes on port 3002...${NC}"

# Check for port 3002 (Backend)
if lsof -i :3002 > /dev/null; then
    echo -e "${YELLOW}Found local process running on port 3002 (Backend). Killing it...${NC}"
    lsof -ti :3002 | xargs kill -9
    echo -e "${GREEN}Process on port 3002 killed.${NC}"
else
    echo -e "${GREEN}Port 3002 is free.${NC}"
fi

# Check for port 6379 (Redis)
if lsof -i :6379 > /dev/null; then
    PID=$(lsof -ti :6379)
    # Get the process command name
    CMD_NAME=$(ps -p $PID -o comm=)
    
    echo -e "${YELLOW}Port 6379 is occupied by PID $PID ($CMD_NAME)${NC}"

    # Check if the process is Docker-related
    if [[ "$CMD_NAME" == *"docker"* ]] || [[ "$CMD_NAME" == *"com.docker"* ]]; then
        echo -e "${YELLOW}Port 6379 is held by Docker. Attempting to identify and stop the container...${NC}"
        
        # 1. Try standard compose down
        (cd docker/backend && $DOCKER_COMPOSE_CMD down)
        
        sleep 2
        
        # 2. Check if still occupied
        if lsof -i :6379 > /dev/null; then
             echo -e "${YELLOW}Port 6379 still occupied. Searching for rogue containers...${NC}"
             
             # Find container ID mapped to 6379
             ROGUE_CONTAINER=$(docker ps --filter "publish=6379" -q)
             
             if [ ! -z "$ROGUE_CONTAINER" ]; then
                 echo -e "${YELLOW}Found rogue container ($ROGUE_CONTAINER) holding port 6379. Force stopping...${NC}"
                 docker rm -f $ROGUE_CONTAINER
             else
                 echo -e "${RED}Port 6379 is held by Docker but no container found. Restarting Docker might be required.${NC}"
                 # Last resort: try to kill the com.docker.backend process if it's zombie?
                 # Better to exit and warn user?
                 # Let's try to proceed, maybe it's just slow?
             fi
        fi
        
        sleep 2
        
        if lsof -i :6379 > /dev/null; then
             echo -e "${RED}Port 6379 is STUCK. Please restart Docker Desktop.${NC}"
             exit 1
        else
             echo -e "${GREEN}Port 6379 is now free.${NC}"
        fi
    else
        # It's a local Redis process (e.g. redis-server), safer to stop/kill
        echo -e "${YELLOW}Found local non-Docker process ($CMD_NAME). Stopping it...${NC}"
        
        if command -v brew &> /dev/null; then
             brew services stop redis || true
        fi

        kill -9 $PID 2>/dev/null || true
        echo -e "${GREEN}Local process killed.${NC}"
    fi
else
    echo -e "${GREEN}Port 6379 is free.${NC}"
fi

# 3. Prepare Environment
echo ""
echo -e "${YELLOW}Preparing Docker environment...${NC}"

# Ensure docker/backend/.env.docker exists
if [ ! -f "docker/backend/.env.docker" ]; then
    echo "Creating docker/backend/.env.docker from example..."
    if [ -f "docker/backend/env.docker.example" ]; then
        cp docker/backend/env.docker.example docker/backend/.env.docker
    else
        # Create default if example doesn't exist
        echo "# Docker Environment Overrides" > docker/backend/.env.docker
        echo "REDIS_HOST=redis" >> docker/backend/.env.docker
        echo "REDIS_PORT=6379" >> docker/backend/.env.docker
        echo "API_PORT=3002" >> docker/backend/.env.docker
        echo "NODE_ENV=production" >> docker/backend/.env.docker
    fi
fi

# 4. Start Containers
echo ""
echo -e "${YELLOW}Starting backend containers...${NC}"
cd docker/backend

# Build & Up
$DOCKER_COMPOSE_CMD up -d --build

# Check status
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Docker containers started successfully!${NC}"
    echo ""
    echo -e "Backend API:    ${GREEN}http://localhost:3002${NC}"
    echo -e "Health Check:   ${GREEN}http://localhost:3002/health${NC}"
    echo ""
    echo -e "${YELLOW}Showing logs (Ctrl+C to exit logs, containers will keep running):${NC}"
    echo "--------------------------------------------------------"
    $DOCKER_COMPOSE_CMD logs -f
else
    echo -e "${RED}❌ Failed to start Docker containers.${NC}"
    exit 1
fi
