# Usar a imagem oficial do Bun
FROM oven/bun:latest AS base
WORKDIR /app

# Instalar dependências
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Instalar dependências de produção
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Build do projeto
FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Variáveis de ambiente para o build (se necessário)
ARG DATABASE_URL
ARG NEXT_PUBLIC_API_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN bun run build

# Imagem final de produção
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=build /app/.next .next
COPY --from=build /app/public public
COPY --from=build /app/package.json .

# Expor a porta 3000
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["bun", "run", "start"]
