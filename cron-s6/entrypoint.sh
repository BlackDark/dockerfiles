#!/bin/sh

env >> /etc/environment

echo "Starting cron ..."

exec 2>&1
exec cron -f -L 2

