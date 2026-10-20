FROM oven/bun:1.4.3-debian@sha256:923bedb355f7746666659f71e724998159a5c8c54bd1cb1030e1975a0698415b AS base
WORKDIR /app

FROM base AS deps
# tsconfig stays out: bun install never reads it, and its content would key this stage's install layer.
COPY package.json bun.lock bunfig.toml ./
COPY backend/package.json backend/
COPY shared/package.json shared/
COPY frontend/package.json frontend/
COPY vendor/ vendor/
COPY patches/ patches/
RUN bun install --frozen-lockfile

FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules

COPY tsconfig.json ./
COPY backend/ ./backend/
COPY shared/ ./shared/

WORKDIR /app/backend
EXPOSE 3000
CMD ["bun", "--watch", "src/index.ts"]

FROM oven/bun:1.4.3-debian@sha256:923bedb355f7746666659f71e724998159a5c8c54bd1cb1030e1975a0698415b AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock tsconfig.json bunfig.toml ./

# bun install needs the workspace dirs to exist.
RUN mkdir -p backend shared frontend

COPY backend/package.json backend/
COPY shared/package.json shared/
COPY frontend/package.json frontend/
COPY vendor/ vendor/
COPY patches/ patches/

RUN bun install --frozen-lockfile --production

COPY backend/ ./backend/
COPY shared/ ./shared/

USER bun
EXPOSE 3000
CMD ["bun", "--preload", "./backend/src/instrumentation.ts", "backend/src/index.ts"]
