FROM node:14.15.5-alpine3.10

RUN apk update && apk add rsync

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Create and define the node_modules's cache directory.
RUN mkdir -p /usr/src/cache
WORKDIR /usr/src/cache

COPY . .

RUN yarn install
# RUN yarn build

WORKDIR /usr/src/app
COPY . .

RUN ["chmod", "+x", "/usr/src/app/entrypoint.sh"]
