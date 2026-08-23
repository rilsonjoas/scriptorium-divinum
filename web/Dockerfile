# Build a partir da RAIZ do monorepo:
#   docker build -f web/Dockerfile -t scriptorium-web \
#     --build-arg VITE_API_URL=https://api-scriptorium.narniano.com .

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /repo

FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY server/package.json ./server/package.json
COPY web/package.json ./web/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ARG VITE_UMAMI_SRC
ENV VITE_UMAMI_SRC=${VITE_UMAMI_SRC}
ARG VITE_UMAMI_WEBSITE_ID
ENV VITE_UMAMI_WEBSITE_ID=${VITE_UMAMI_WEBSITE_ID}
ARG VITE_AMAZON_TAG
ENV VITE_AMAZON_TAG=${VITE_AMAZON_TAG}
COPY web ./web
RUN pnpm --filter web build

FROM nginx:1.27-alpine AS runtime
COPY web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/web/dist /usr/share/nginx/html
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1
EXPOSE 80
