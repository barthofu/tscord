# ======================
# ===== Build stage ====
# ======================

FROM node:20.11-alpine as builder

    WORKDIR /app

    COPY src ./src
    COPY tsconfig.json .
    COPY package.json .
    COPY package-lock.json .

    # install deps
    RUN apk add --no-cache --virtual .build-deps alpine-sdk python3 && \
        npm ci --silent && \
        npm run install:plugins && \
        apk del .build-deps

    # build project
    RUN npm run build

# ==================
# ===== Run stage =====
# ==================

FROM node:20.11-alpine as runner

    WORKDIR /app

    # set production mode
    ARG NODE_ENV=production
    ENV NODE_ENV $NODE_ENV

    # copy build files from builder
    COPY --from=builder /app/build /app/build
    COPY --from=builder /app/package.json /app/package.json
    COPY --from=builder /app/package-lock.json /app/package-lock.json

    # purge dev dependencies
    # RUN npm prune --omit=dev && \
    RUN apk add --no-cache --virtual .build-deps alpine-sdk python3 && \
        npm ci --silent --only=production && \
        npm cache clean --force && \
        apk del .build-deps

    # finaly start the bot
    CMD ["npm", "run", "start"]