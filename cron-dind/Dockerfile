FROM blackdark93/dockerfiles-cron-s6:main

LABEL MAINTAINER="blackdark93"

RUN apt-get update \
  && apt install -y ca-certificates curl gnupg \
  && rm -rf /var/lib/apt/lists/* \
  && install -m 0755 -d /etc/apt/keyrings \
  && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
  && chmod a+r /etc/apt/keyrings/docker.gpg \
  && echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null \
  && apt-get update  \
  && apt install -y docker-ce-cli \
  && rm -rf /var/lib/apt/lists/*
