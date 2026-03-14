# ─── Stage 1: Instalar dependências com Bun ───────────────────────────────────
FROM oven/bun:latest AS install
WORKDIR /app

RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# ─── Stage 2: Build com Node.js (evita SIGILL do Bun em CPUs antigas/EC2) ─────
FROM node:22-alpine AS build
WORKDIR /app

COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ARG DATABASE_URL
ARG NEXT_PUBLIC_API_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npx next build

# ─── Stage 3: Runtime de produção com Bun ─────────────────────────────────────
FROM oven/bun:latest AS release
WORKDIR /app

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=build /app/.next .next
COPY --from=build /app/public public
COPY --from=build /app/package.json .

EXPOSE 3000

CMD ["bun", "run", "start"]
