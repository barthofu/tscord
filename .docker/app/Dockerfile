# This dockerfile has multiple stages in order
# to optimize the build process time and reduce 
# the final image size.

# ============================
# ==== Dependencies stage ====
# ============================

FROM node:20.11-alpine as dependencies

    WORKDIR /app

    COPY package.json .
    COPY package-lock.json .

    # install deps
    RUN apk add --no-cache --virtual .build-deps alpine-sdk python3 && \
        npm ci --silent && \
        apk del .build-deps

# ======================
# ===== Build stage ====
# ======================

FROM node:20.11-alpine as builder

    WORKDIR /app

    # copy source files
    COPY src ./src
    COPY tsconfig.json .

    # copy build files from dependencies stage
    COPY --from=dependencies /app/package.json .
    COPY --from=dependencies /app/package-lock.json .
    COPY --from=dependencies /app/node_modules /app/node_modules

    # install plugin dependencies
    RUN npm run install:plugins

    # build the project
    RUN npm run build

# ========================
# ===== Prepare stage ====
# ========================

FROM node:20.11-alpine as prepare

    WORKDIR /app

    # copy build files from builder stage
    COPY --from=builder /app/build /app/build
    COPY --from=builder /app/package.json /app/package.json
    COPY --from=builder /app/package-lock.json /app/package-lock.json
    COPY --from=builder /app/node_modules /app/node_modules

    # purge dev dependencies
    RUN npm prune --omit=dev

# =====================
# ===== Run stage =====
# =====================

FROM node:20.11-alpine as runner

    WORKDIR /app

    # set production mode
    ARG NODE_ENV=production
    ENV NODE_ENV $NODE_ENV

    # copy build files from prepare stage
    COPY --from=prepare /app/build /app/build
    COPY --from=prepare /app/package.json /app/package.json
    COPY --from=prepare /app/package-lock.json /app/package-lock.json
    COPY --from=prepare /app/node_modules /app/node_modules

    # finaly start the bot
    CMD ["npm", "run", "start"]