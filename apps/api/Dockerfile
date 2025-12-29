# =============================================================================
# Stage 1: Dependencies + Build (using Bun)
# =============================================================================
FROM oven/bun:1.3-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json bun.lock ./
COPY turbo.json ./

# Copy ALL workspace package.json files
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/admin/package.json ./apps/admin/
COPY packages/database/package.json ./packages/database/
COPY packages/file-upload/package.json ./packages/file-upload/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install ALL dependencies
RUN bun install

# Copy source code
COPY apps/api ./apps/api
COPY packages/database ./packages/database
COPY packages/file-upload ./packages/file-upload

# Generate Prisma client
RUN cd packages/database && bunx prisma generate

# Build the file-upload package first (API depends on it)
RUN cd packages/file-upload && bunx tsc

# Build the API using tsc directly (avoid nest CLI issues)
RUN cd apps/api && bunx tsc -p tsconfig.build.json

# =============================================================================
# Stage 2: Production (simplified - copy everything)
# =============================================================================
FROM oven/bun:1.3-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 appgroup
RUN adduser --system --uid 1001 appuser

# Copy everything from builder (simpler, ensures all symlinks work)
COPY --from=builder /app /app

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

# Expose port
EXPOSE 4000

# Set environment
ENV NODE_ENV=production
ENV PORT=4000

# Start the application with Bun from the monorepo root
CMD ["bun", "run", "apps/api/dist/main.js"]
