# no arm builds
FROM steamcmd/steamcmd:ubuntu-22
LABEL maintainer="Tim Chaubet"
VOLUME ["/mnt/vrising/server", "/mnt/vrising/persistentdata"]

ARG DEBIAN_FRONTEND="noninteractive"

RUN useradd -m steam && cd /home/steam && \
    echo steam steam/question select "I AGREE" | debconf-set-selections && \
    echo steam steam/license note '' | debconf-set-selections && \
    apt update && \
    apt install -y software-properties-common && \
    add-apt-repository multiverse && \
    apt install -y gdebi-core  \
                   libgl1-mesa-glx:i386 \
                   wget xvfb

#RUN apt install -y mono-complete
RUN apt update && \
    wget -nc -O /etc/apt/keyrings/winehq-archive.key https://dl.winehq.org/wine-builds/winehq.key && \
    wget -NP /etc/apt/sources.list.d/ https://dl.winehq.org/wine-builds/ubuntu/dists/jammy/winehq-jammy.sources && \
    apt update && \
    apt install --install-recommends -y winehq-stable winbind winetricks

# RUN apt install -y xserver-xorg \
#                    xvfb

# RUN rm -rf /var/lib/apt/lists/* && \
#     apt clean && \
#     apt autoremove -y


COPY start.sh /start.sh
RUN chmod +x /start.sh
CMD ["/start.sh"]
