FROM python:3.12.2-slim-bullseye
WORKDIR /app

RUN pip install cloudflare schedule

COPY main.py .

ENV CF_DOMAIN=

CMD python -u main.py $CF_DOMAIN
