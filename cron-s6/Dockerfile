FROM ubuntu:22.04
LABEL MAINTAINER="blackdark93"

RUN apt-get update && apt-get install -y \
  curl \
  uuid-runtime \
  cron rsyslog \
  xz-utils \
 && rm -rf /var/lib/apt/lists/*

ARG S6_OVERLAY_VERSION=3.1.5.0
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-x86_64.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-x86_64.tar.xz

WORKDIR /app
RUN apt update && apt install -y daemontools

ADD s6-overlay /etc/s6-overlay

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
ENTRYPOINT [ "/init" ]
#CMD ["/app/entrypoint.sh"]
