# ===========================
#          Builder
# ===========================

FROM node:16.17-buster-slim as builder

    # Set temp directory
    WORKDIR /tmp/app

    # Move package.json and package-lock.json
    COPY package.json .
    COPY src ./src

    # Install dependencies from package.json
    # and install dependencies for plugins (because postinstall script doesn't work in docker)
    RUN npm i

    COPY .swcrc .
    COPY tsconfig.json .

    # Build project
    RUN npm run build

# ===========================
#      Production Runner
# ===========================

FROM node:16.17-buster-slim as runner

    # set production mode
    ARG NODE_ENV=production
    ENV NODE_ENV $NODE_ENV

    # Set work directory
    WORKDIR /app

    # Copy package.json and package-lock.json from builder
    COPY --from=builder /tmp/app/package.json /app/package.json
    COPY --from=builder /tmp/app/package-lock.json /app/package-lock.json

    # Move build files
    COPY --from=builder /tmp/app/build /app/build

    # Install dependencies from package-lock.json
    # and install dependencies for plugins (because plugins:install script doesn't work in docker)
    RUN npm ci --omit=dev && npm cache clean --force 

    # Finaly start the bot
    CMD ["node", "build/main.js"]