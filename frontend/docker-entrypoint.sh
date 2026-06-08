#!/bin/sh
# Ersetzt den DNS-Resolver-Platzhalter in der nginx-Konfiguration durch den
# tatsächlichen Resolver des Containers (aus /etc/resolv.conf), bevor nginx
# startet. So funktioniert die dynamische Hostnamen-Auflösung unabhängig
# davon, in welcher Umgebung (Docker Compose, Railway, ...) der Container läuft.
set -e

DNS_RESOLVER="$(awk '/^nameserver/ { print $2; exit }' /etc/resolv.conf)"

if [ -z "$DNS_RESOLVER" ]; then
    echo "Warnung: Kein DNS-Resolver in /etc/resolv.conf gefunden, verwende 127.0.0.11" >&2
    DNS_RESOLVER="127.0.0.11"
fi

sed "s/__DNS_RESOLVER__/${DNS_RESOLVER}/g" \
    /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g "daemon off;"
