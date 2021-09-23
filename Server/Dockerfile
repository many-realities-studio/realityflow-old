FROM nikolaik/python-nodejs:python3.9-nodejs16-alpine as build
# Create app directory
WORKDIR /usr/
RUN apk update \
  && apk add --update alpine-sdk \
  && apk add sqlite \
  && apk add socat \
  && apk add bash
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY prisma/ src/ run/ tsconfig.json package*.json ./
VOLUME /usr/src
RUN npm install
# RUN npm run build

# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source
# FROM nikolaik/python-nodejs:python3.9-nodejs14-alpine as api-prod
# RUN apk update \
#   && apk add sqlite \
#   && apk add --update alpine-sdk \
#   && apk add socat \
#   && apk add dumb-init
# ENV NODE_ENV production
# WORKDIR /usr/
# COPY --from=build /usr/dist ./dist
# COPY ./package* ./
# RUN npm ci --only=production
# CMD ["dumb-init", "node", "dist/server.js"]