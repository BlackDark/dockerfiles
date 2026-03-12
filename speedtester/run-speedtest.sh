#!/bin/sh
# Read env vars from s6 container environment (not available to cron by default)
for f in /run/s6/container_environment/*; do
    [ -f "$f" ] && export "$(basename "$f")"="$(cat "$f")"
done

SERVER_ARGS=""
if [ -n "$SPEEDTEST_SERVER_ID" ]; then
    SERVER_ARGS="-s $SPEEDTEST_SERVER_ID"
fi

# shellcheck disable=SC2086
/usr/bin/speedtest --accept-license --accept-gdpr $SERVER_ARGS -f json \
    | tee /var/log/cron.log \
    | curl -H 'Content-Type: application/json' -X POST --data-binary @- http://telegraf:8080/telegraf
