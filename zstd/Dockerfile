# syntax=docker/dockerfile:1

# First version with just installing with apk 
FROM alpine
WORKDIR /app
# renovate: datasource=github-releases packageName=facebook/zstd
ARG ZSTD_VERSION=1.5.6
RUN <<EOF
    apk add --no-cache --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community \
        "zstd~=${ZSTD_VERSION}"
EOF

# Ref: https://github.com/DanySK/zstd-container/blob/master/Dockerfile
# FROM alpine:3.20.3 as base

# # First image to build the binary
# FROM base as builder
# RUN apk --no-cache add make gcc libc-dev zstd curl
# # renovate: datasource=github-releases packageName=facebook/zstd
# ARG ZSTD_VERSION=1.5.6
# RUN curl -sL https://github.com/facebook/zstd/releases/download/v${ZSTD_VERSION}/zstd-${ZSTD_VERSION}.tar.zst -o zstd.tar.zst
# RUN unzstd zstd.tar.zst
# RUN tar xf zstd.tar
# RUN mkdir /pkg && cd /zstd-${ZSTD_VERSION} && make && make DESTDIR=/pkg install
# RUN cp /zstd-${ZSTD_VERSION}/LICENSE /LICENSE

# # Second minimal image to only keep the built binary
# FROM base
# # Copy the built files
# COPY --from=builder /pkg /
# # Copy the license as well
# RUN mkdir -p /usr/local/share/licenses/zstd
# COPY --from=builder /LICENSE /usr/local/share/licences/zstd/
# # Just run `zstd` if no other command is given
# CMD ["/usr/local/bin/zstd"]
