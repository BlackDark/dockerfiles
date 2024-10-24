# syntax=docker/dockerfile:1

FROM alpine
WORKDIR /app
ARG ZSTD_VERSION=1.5.6
RUN <<EOF
    apk add --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community \
        "zstd~=${ZSTD_VERSION}"
EOF
