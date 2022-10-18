## build runner
FROM node:16.17-buster-slim as build-runner

# Set temp directory
WORKDIR /tmp/app

# Move package.json and package-lock.json
COPY package.json .
COPY package-lock.json .
COPY src ./src

# Install dependencies from package-lock.json
# and install dependencies for plugins (because postinstall script doesn't work in docker)
RUN npm ci

COPY .swcrc .
COPY tsconfig.json .

# Build project
RUN npm run build

## producation runner
FROM node:16.17-buster-slim as prod-runner

# set production mode
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Set work directory
WORKDIR /app

# Copy package.json and package-lock.json from build-runner
COPY --from=build-runner /tmp/app/package.json /app/package.json
COPY --from=build-runner /tmp/app/package-lock.json /app/package-lock.json

# Move build files
COPY --from=build-runner /tmp/app/build /app/build

# Install dependencies from package-lock.json
# and install dependencies for plugins (because plugins:install script doesn't work in docker)
RUN npm ci --omit=dev && npm cache clean --force 

# Finaly start the bot
CMD ["node", "build/main.js"]