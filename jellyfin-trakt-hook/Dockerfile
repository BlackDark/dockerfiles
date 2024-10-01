# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
FROM node:22.9.0-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"


RUN apk add --no-cache tini

RUN corepack enable \
    && corepack prepare pnpm@9 --activate

RUN mkdir -p /home/node/app/node_modules && chown -R 1000:1000 /home/node/app
WORKDIR /home/node/app

COPY --chown=1000:1000 package.json pnpm-lock.yaml ./

USER 1000

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base
RUN corepack use pnpm@9

COPY --from=prod-deps /home/node/app/node_modules /home/node/app/node_modules
COPY --chown=1000:1000 src ./src

EXPOSE 5000

ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "node", "src/index.js" ]
