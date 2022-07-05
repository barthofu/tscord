## build runner
FROM node:lts-alpine as build-runner

# Set temp directory
WORKDIR /tmp/app

# Move package.json and package-lock.json
COPY package.json .
COPY package-lock.json .

# Install dependencies from package-lock.json
RUN npm ci

# Move source files
COPY src ./src
COPY assets ./assets

COPY tsconfig.json .
COPY mikro-orm.config.ts .

# Build project
RUN npm run build

## producation runner
FROM node:lts-alpine as prod-runner

# Set work directory
WORKDIR /app

# Copy package.json and package-lock.json from build-runner
COPY --from=build-runner /tmp/app/package.json /app/package.json
COPY --from=build-runner /tmp/app/package-lock.json /app/package-lock.json

# Install dependencies from package-lock.json
RUN npm ci --omit=dev

# Move build files
COPY --from=build-runner /tmp/app/build /app/build