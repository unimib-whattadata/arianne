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
RUN pnpm build

# 4. Runner
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/next.config.js /app/next.config.js
COPY --from=builder /app/public /app/public
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/.next/standalone /app/.next/standalone
COPY --from=builder /app/.next/static /app/.next/static

EXPOSE 3000
CMD ["node", "/app/.next/standalone/server.js"]
