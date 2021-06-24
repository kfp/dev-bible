FROM node:latest

RUN yarn set version berry

RUN mkdir /app
COPY yarn.lock package.json .yarnrc.yml /app
COPY src /app/src
COPY public /app/public
copy .yarn /app/.yarn
WORKDIR /app

RUN yarn install && yarn build
CMD yarn start

