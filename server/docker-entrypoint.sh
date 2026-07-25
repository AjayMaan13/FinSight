#!/bin/sh
# Migrate, then seed (ignoring failures on reruns — e.g. duplicate demo
# emails from a previous deploy), then start the API. A single script file
# instead of an inline shell one-liner in docker-compose/render.yaml, so
# there's no ambiguity in how a host's dockerCommand-equivalent field
# tokenizes or (re-)wraps a multi-command string.
set -e

npx sequelize db:migrate
npx sequelize db:seed:all || true
exec node server.js
