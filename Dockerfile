# Dockerfile for Next.js application

# 1. Base image
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

# 2. Dependencies
FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 3. Builder
FROM base AS builder
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/package.json /app/package.json
RUN SKIP_ENV_VALIDATION=1 pnpm build

# 4. Runner
FROM base AS runner
# Install curl for health checks
RUN apt-get update && apt-get install -y curl --no-install-recommends && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
WORKDIR /app
# Copy standalone build output
COPY --from=builder /app/.next/standalone/ .
# Copy static assets
COPY --from=builder /app/public ./public
# Expose port
EXPOSE 3000
# Start the server binding to all interfaces
CMD ["node", "server.js", "--hostname", "0.0.0.0", "--port", "3000"]
