FROM node:lts-alpine3.14 as build
# Create app directory
WORKDIR /usr/
RUN apk update \
  && apk add sqlite \
  && apk add socat \
  && apk add python

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json tsconfig.json ./
RUN npm install
RUN npm run build

# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source
FROM node:lts-alpine3.10 as api-prod
RUN apk update \
  && apk add sqlite \
  && apk add socat \
  && apk add python \
  && apk add dumb-init
ENV NODE_ENV production
WORKDIR /usr/
COPY --from=build /usr/dist ./dist
COPY ./package* ./
RUN npm ci --only=production

CMD ["dumb-init", "node", "dist/server.js"]