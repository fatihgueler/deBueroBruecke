FROM node:20-alpine AS builder
WORKDIR /app
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Nginx für statische Dateien
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Läuft automatisch vor dem nginx-Start (offizieller Mechanismus des
# nginx-Images: alle ausführbaren *.sh in /docker-entrypoint.d/ werden vom
# Standard-Entrypoint aufgerufen) und ersetzt den DNS-Resolver-Platzhalter
# in der Config durch den im Container tatsächlich verfügbaren Resolver.
COPY resolve-dns.sh /docker-entrypoint.d/30-resolve-dns.sh
RUN chmod +x /docker-entrypoint.d/30-resolve-dns.sh

EXPOSE 80

