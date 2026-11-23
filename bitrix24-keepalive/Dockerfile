FROM blackdark93/dockerfiles-cron-s6:main@sha256:06f5f7c75976b20af70e0edf292338aa452b4c1d4affe760c75dc27cac26ad88

LABEL MAINTAINER="blackdark93"

COPY bitrix24.sh .
RUN chmod +x bitrix24.sh

ENV DOCKER_USER=
ENV DOCKER_PASS=
ENV DOCKER_ACCOUNT=
