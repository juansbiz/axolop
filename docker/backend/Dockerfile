# Axolop CRM - Multi-stage Dockerfile
# Stage 1: Builder
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install && npm prune --production && npm cache clean --force

# Copy application source
COPY src/backend ./src/backend

# ============================================
# Stage 2: Backend Production
# ============================================
FROM node:20-slim AS backend

# Install dumb-init
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && rm -rf /var/lib/apt/lists/*

# Create app user
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -s /bin/sh -m nodejs

WORKDIR /app

# Copy node_modules and source from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs package*.json ./
COPY --from=builder --chown=nodejs:nodejs src/backend ./src/backend

USER nodejs

ENV PORT=3002
EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3002) + '/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/backend/index.js"]

# ============================================
# Stage 3: Frontend (built externally or use dist)
# ============================================
FROM nginx:alpine AS frontend

# Copy built frontend (expects dist folder to exist)
COPY dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
