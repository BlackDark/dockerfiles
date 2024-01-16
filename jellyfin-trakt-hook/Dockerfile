FROM node:20-alpine

RUN apk add --no-cache tini

RUN mkdir -p /home/node/app/node_modules && chown -R 1000:1000 /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER 1000

RUN npm install

COPY --chown=1000:1000 src ./src

EXPOSE 5000

ENTRYPOINT ["/sbin/tini", "--"]

CMD [ "node", "src/index.js" ]
