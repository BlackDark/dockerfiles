# Cron container with s6 overlay

Cron jobs must log to `/var/log/cron.log` in order to be displayed in container logs.

```txt
* * * * * root /app/execute.sh >> /var/log/cron.log 2>&1
@reboot root /app/execute.sh >> /var/log/cron.log 2>&1
```

Example:
```bash
docker run --rm \
    -v $(pwd)/crontab:/etc/cron.d/scheduler \
    -v $(pwd)/execute.sh:/app/execute.sh \
    -e HALLO=test test:test
```

## TODO alpine dind cron

```bash
docker run --rm \
    -v $(pwd)/crontab:/etc/crontabs/root \
    -v $(pwd)/execute.sh:/app/execute.sh \
    -e HALLO=test --entrypoint="crond" --init docker:dind -f -L /dev/stdout 
```
