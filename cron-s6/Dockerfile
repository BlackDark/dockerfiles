FROM ubuntu:24.04
LABEL MAINTAINER="blackdark93"

RUN apt-get update && apt-get install -y \
  curl \
  uuid-runtime \
  cron \
  xz-utils \
 && rm -rf /var/lib/apt/lists/*

# renovate: datasource=github-releases packageName=just-containers/s6-overlay versioning=loose
ARG S6_OVERLAY_VERSION=3.2.0.0

ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-x86_64.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-x86_64.tar.xz
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/syslogd-overlay-noarch.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/syslogd-overlay-noarch.tar.xz

WORKDIR /app

ADD s6-overlay /etc/s6-overlay

ENTRYPOINT [ "/init" ]
