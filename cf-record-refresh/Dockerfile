FROM python:3.13.6-slim-bullseye@sha256:e98b521460ee75bca92175c16247bdf7275637a8faaeb2bcfa19d879ae5c4b9a
WORKDIR /app

RUN pip install cloudflare schedule

COPY main.py .

ENV CF_DOMAIN=

CMD python -u main.py $CF_DOMAIN
