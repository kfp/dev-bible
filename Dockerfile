FROM node:latest

RUN yarn set version berry

# RUN mkdir /src
COPY yarn.lock package.json .yarnrc.yml /app
COPY src /app/src
COPY public /app/public
WORKDIR /app

RUN yarn install && yarn build
CMD yarn start

