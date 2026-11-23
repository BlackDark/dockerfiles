FROM blackdark93/dockerfiles-cron-s6:main@sha256:06f5f7c75976b20af70e0edf292338aa452b4c1d4affe760c75dc27cac26ad88

LABEL MAINTAINER="blackdark93"

RUN apt-get update && apt-get install -y \
  curl \
  && curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh | os=ubuntu dist=jammy bash \
  && apt update \
  && apt install speedtest \
  && rm -rf /var/lib/apt/lists/*
# install instruction: https://www.speedtest.net/apps/cli
# https://packagecloud.io/ookla/speedtest-cli/install
# packagecloud.io has no noble release; jammy packages are compatible

# Optional: set a specific speedtest server ID (default: auto-select)
# ENV SPEEDTEST_SERVER_ID=

COPY run-speedtest.sh /usr/local/bin/run-speedtest
RUN chmod +x /usr/local/bin/run-speedtest

COPY cronfile /app/schedules/speedtester
