# Production image for devmemory (Next.js standalone output).
# Based on the official Next.js Docker example:
# https://github.com/vercel/next.js/tree/canary/examples/with-docker
#
# Build:  docker build -t devmemory .
# Run:    docker run -p 3000:3000 --env-file .env.local devmemory
#
# On Render this image is used by setting `runtime: docker` in render.yaml.

ARG NODE_VERSION=24-slim

# ============================================
# Stage 1: install dependencies
# ============================================
FROM node:${NODE_VERSION} AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# ============================================
# Stage 2: build the app
# ============================================
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_OUTPUT=standalone
RUN npm run build

# ============================================
# Stage 3: run the app
# ============================================
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Next's standalone server reads these; Render overrides PORT.
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

RUN mkdir -p .next && chown node:node .next
USER node
EXPOSE 3000
CMD ["node", "server.js"]
