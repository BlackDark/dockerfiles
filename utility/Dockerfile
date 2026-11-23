# syntax=docker/dockerfile:1@sha256:572cebbc2b15e6f84c077742952674889cb63cd5e9b80abdffcbe587b6f19183

FROM alpine@sha256:f59abe656b692d901e184be3445e084786602108599d2a51d229c0f5a48c71bf
WORKDIR /app
ARG ZSTD_VERSION=1.5.6
RUN <<EOF
    apk add --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community \
        "zstd~=${ZSTD_VERSION}"
EOF
