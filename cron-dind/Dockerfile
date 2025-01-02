FROM blackdark93/dockerfiles-cron-s6:main

LABEL MAINTAINER="blackdark93"

ARG TARGETPLATFORM

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


# renovate: datasource=github-releases packageName=getsops/sops versioning=loose
ENV SOPS_VERSION=v3.9.3
# renovate: datasource=github-releases packageName=FiloSottile/age versioning=loose
ENV AGE_VERSION=v1.2.1

ENV GITHUB_URL=https://github.com
ENV BIN_TARGET=/usr/bin

RUN <<EOF
  if [ "$TARGETPLATFORM" = "linux/amd64" ]; then
  ARCHITECTURE=amd64;
  OS=linux
  PACKAGE_ARCH=amd64
  elif [ "$TARGETPLATFORM" = "linux/arm/v7" ]; then
  ARCHITECTURE=arm;
  OS=linux
  PACKAGE_ARCH=arm
  elif [ "$TARGETPLATFORM" = "linux/arm64" ]; then
  ARCHITECTURE=aarch64;
  OS=linux
  PACKAGE_ARCH=arm64
  else
  ARCHITECTURE=amd64;
  OS=linux
  PACKAGE_ARCH=arm64
  fi
  export ARCHITECTURE=$ARCHITECTURE
  export OS=$OS
  export PACKAGE_ARCH=$PACKAGE_ARCH

  echo "$GITHUB_URL/getsops/sops/releases/download/${SOPS_VERSION}/sops-${SOPS_VERSION}.$OS.$PACKAGE_ARCH"
  echo "$GITHUB_URL/FiloSottile/age/releases/download/${AGE_VERSION}/age-${AGE_VERSION}-$OS-$PACKAGE_ARCH.tar.gz"

  mkdir -p $BIN_TARGET

  # install sops
  curl -s -L -o $BIN_TARGET/sops $GITHUB_URL/getsops/sops/releases/download/${SOPS_VERSION}/sops-${SOPS_VERSION}.$OS.$PACKAGE_ARCH
  chmod +x $BIN_TARGET/sops

  # install AGE
  curl -s -L -o "age-archive.tar.gz" $GITHUB_URL/FiloSottile/age/releases/download/${AGE_VERSION}/age-${AGE_VERSION}-$OS-$PACKAGE_ARCH.tar.gz
  ls -lah
  tar -xzvf age-archive.tar.gz && rm -rf age-archive.tar.gz
  mv age/age $BIN_TARGET
  mv age/age-keygen $BIN_TARGET
  rm -rf age
  chmod +x $BIN_TARGET/age
  chmod +x $BIN_TARGET/age-keygen
EOF
