FROM node:20-alpine

WORKDIR /app

# Full install (not --omit=dev): sequelize-cli is a devDependency and is
# needed at container startup to run migrations/seeders.
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5001

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=5 \
  CMD node -e "require('http').get('http://localhost:5001/', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
