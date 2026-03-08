# ---------- base ----------
FROM oven/bun:1.3.9-debian AS base
WORKDIR /app

# ---------- deps ----------
FROM base AS deps
COPY package.json bun.lock tsconfig.json ./
COPY backend/package.json backend/
COPY shared/package.json shared/
COPY frontend/package.json frontend/
RUN bun install --frozen-lockfile

# ---------- dev ----------
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules

COPY tsconfig.json ./
COPY backend/ ./backend/
COPY shared/ ./shared/

# 🔥 Plus besoin de rm -rf car typescript n'est pas dans shared/
RUN bunx tsc -b shared/tsconfig.json

WORKDIR /app/backend
EXPOSE 3000
CMD ["bun", "--watch", "src/index.ts"]

# ---------- prod ----------
FROM oven/bun:1.3.9-debian AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock ./
RUN mkdir -p backend shared
COPY backend/package.json backend/
COPY shared/package.json shared/
RUN bun install --frozen-lockfile --production

COPY backend/ ./backend/
COPY shared/ ./shared/

RUN cd /app/shared && bun run build

USER bun
EXPOSE 3000
CMD ["bun", "backend/src/index.ts"]
