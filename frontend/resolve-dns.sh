#!/bin/sh
# Wird automatisch vom offiziellen nginx-Entrypoint vor dem Start ausgeführt
# (Skripte in /docker-entrypoint.d/ laufen in alphabetischer Reihenfolge).
#
# Ersetzt den Platzhalter __DNS_RESOLVER__ in der nginx-Konfiguration durch
# den tatsächlichen Resolver aus /etc/resolv.conf des laufenden Containers.
# So funktioniert die dynamische Hostnamen-Auflösung unabhängig davon, in
# welcher Umgebung (Docker Compose, Railway, ...) der Container läuft –
# statt eine feste IP zu raten, die in der jeweiligen Umgebung evtl. gar
# nicht existiert (z.B. 127.0.0.11 unter Railway: "Connection refused").
set -e

DNS_RESOLVER="$(awk '/^nameserver/ { print $2; exit }' /etc/resolv.conf)"

if [ -z "$DNS_RESOLVER" ]; then
    echo "Warnung: Kein DNS-Resolver in /etc/resolv.conf gefunden, verwende 127.0.0.11" >&2
    DNS_RESOLVER="127.0.0.11"
fi

# IPv6-Adressen (z.B. Railways "fd12::10") müssen im nginx-resolver-Directive
# in eckigen Klammern stehen ("[fd12::10]:53"), sonst hält nginx den Doppelpunkt
# fälschlich für eine Port-Angabe ("invalid port in resolver").
case "$DNS_RESOLVER" in
    *:*) DNS_RESOLVER="[${DNS_RESOLVER}]" ;;
esac

sed -i "s/__DNS_RESOLVER__/${DNS_RESOLVER}/g" /etc/nginx/conf.d/default.conf
