#################
#Build
#################
FROM --platform=linux/amd64 node:20.15.1-alpine3.20 AS build

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install --frozen-lockfile

COPY .eslintrc.cjs ./
COPY eslint.config.js ./
COPY .declaration.module.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY .prettierrc ./
COPY tsconfig.app.tsbuildinfo ./
COPY tsconfig.node.tsbuildinfo ./
COPY tsconfig.app.json ./
COPY index.html ./
COPY vite.config.ts ./
COPY ./src ./src/

RUN yarn build

#################
#Start
#################
FROM --platform=linux/amd64 node:20.15.1-alpine3.20 AS deploy

WORKDIR /app

RUN apk add bash && \
  yarn global add serve

COPY --from=build ./app/dist ./dist

CMD ["/bin/bash", "-c", "serve -s dist"]
