FROM blackdark93/dockerfiles-cron-s6:main

LABEL MAINTAINER="blackdark93"

RUN apt-get update && apt-get install -y \
  curl \
  && curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh | bash \
  && apt update \
  && apt install speedtest \
  && rm -rf /var/lib/apt/lists/*
# install instruction: https://www.speedtest.net/apps/cli
# https://packagecloud.io/ookla/speedtest-cli/install
