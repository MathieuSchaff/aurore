#!/bin/sh
# Starts nginx and reloads it every 6h to pick up renewed SSL certificates.
# Certbot renews certs every 12h — a 6h reload window ensures we never serve
# an expired cert for more than one interval.
set -e

nginx -g "daemon off;" &
NGINX_PID=$!

_stop() {
    nginx -s quit
    wait "$NGINX_PID" 2>/dev/null
    exit 0
}
trap _stop TERM INT

while kill -0 "$NGINX_PID" 2>/dev/null; do
    sleep 21600 &  # 6 hours
    wait $!
    kill -0 "$NGINX_PID" 2>/dev/null && nginx -s reload 2>/dev/null || true
done
