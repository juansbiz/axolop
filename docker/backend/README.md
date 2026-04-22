# Axolop CRM Backend - Docker Setup

This directory contains the Docker configuration for running the Axolop CRM backend services.

## Architecture

The backend infrastructure is orchestrated using Docker Compose and consists of:

1.  **Backend (Node.js)**: The main Express application running on port 3002.
2.  **Redis**: In-memory data store for caching and rate limiting, internal to the Docker network.
3.  **ChromaDB**: **External Service**. The backend connects to an external AI server for vector database operations.

## Local Development

### Prerequisites

- Docker Desktop installed and running
- Node.js 20+ (for local scripts)

### Quick Start

Use the npm scripts from the root directory:

```bash
# Start backend and Redis
npm run docker:up

# View logs
npm run docker:logs

# Stop containers
npm run docker:down
```

### Environment Configuration

The Docker setup uses two sources for environment variables:

1.  **Root `.env`**: The main project configuration.
2.  **`docker/backend/.env.docker`**: Docker-specific overrides (internal hostnames, etc.).

**Initial Setup:**
The start script (`npm run docker:up`) automatically creates `.env.docker` from `env.docker.example` if it doesn't exist.

### External Services

Since ChromaDB is not containerized in this setup, ensure your `CHROMADB_URL` in `.env` (or `.env.docker`) points to the correct external address.

- Local External: `http://host.docker.internal:8001`
- Production External: `http://your-ai-server-ip:8001`

## Deployment (Railway)

This `docker-compose.yml` is deployment-ready for Railway or any Docker-based hosting provider.

**Railway Setup:**

1.  Connect your repository to Railway.
2.  Set the **Root Directory** to `docker/backend` in Railway settings.
3.  Configure all environment variables from your `.env` file in the Railway dashboard.
4.  Expose port `3002`.

**Persistent Volumes:**

- Redis data is persisted to the `redis-data` volume. ensure your hosting provider supports persistent volumes if you need cache survival across restarts (though Redis is often treated as ephemeral).
