FROM node:alpine

RUN apk add --no-cache tini

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 5000


ENTRYPOINT ["/sbin/tini", "--"]

CMD [ "node", "src/index.js" ]
