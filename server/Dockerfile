# Build a partir da RAIZ do monorepo:
#   docker build -f server/Dockerfile -t scriptorium-api .

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /repo

FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY server/package.json ./server/package.json
COPY web/package.json ./web/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY server ./server
RUN pnpm --filter server build

FROM build AS pruned
RUN pnpm --filter server deploy --prod --legacy /prod/server

FROM node:22-alpine AS runtime
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=pruned --chown=app:app /prod/server ./
# Migrations + SQL customizado para rodar via `docker exec scriptorium-api node dist/db/migrate.js`
COPY --from=build --chown=app:app /repo/server/src/db/migrations ./dist/db/migrations
COPY --from=build --chown=app:app /repo/server/src/db/custom-sql ./dist/db/custom-sql
USER app
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/server.js"]
