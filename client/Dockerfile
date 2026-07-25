# Multi-stage build: compile the SPA with Node, then serve the static output
# with nginx. Keeps the final image small — no Node runtime or node_modules
# ship in production, just the built HTML/JS/CSS.

# ── Build stage ──────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite bakes VITE_* vars into the bundle at build time, so it must be
# supplied as a build arg (the browser calls this URL directly — it never
# goes through the Docker network).
ARG VITE_API_URL=http://localhost:5001/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Serve stage ──────────────────────────────────────────
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
  CMD wget -q -O /dev/null http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
