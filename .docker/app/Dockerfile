## build runner
FROM node:16.17-alpine as build-runner

# Set temp directory
WORKDIR /tmp/app

# Move package.json and package-lock.json
COPY package.json .
COPY package-lock.json .

# Install dependencies from package-lock.json
RUN npm ci && npm cache clean --force

# Move source files
COPY src ./src

COPY .swcrc .
COPY tsconfig.json .

# Build project
RUN npm run build

## producation runner
FROM node:16.17-alpine as prod-runner

# set production mode
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Set work directory
WORKDIR /app

# Copy package.json and package-lock.json from build-runner
COPY --from=build-runner /tmp/app/package.json /app/package.json
COPY --from=build-runner /tmp/app/package-lock.json /app/package-lock.json

# Install dependencies from package-lock.json
RUN npm ci --omit=dev

# Move build files
COPY --from=build-runner /tmp/app/build /app/build
# COPY assets /app/assets

# Finaly start the bot
CMD ["node", "build/main.js"]