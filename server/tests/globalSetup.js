// Runs once before the whole test run: rebuilds the test schema by running
// the real migrations (not sequelize.sync), so tests exercise the exact
// schema-creation path production uses.
const { execSync } = require('child_process');

process.env.NODE_ENV = 'test';
require('dotenv').config();

module.exports = async () => {
  const db = require('../models');

  // Drop and recreate the public schema so every test run starts from a
  // known-empty database, regardless of what a previous run left behind.
  await db.sequelize.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await db.sequelize.close();

  execSync('npx sequelize-cli db:migrate --env test', {
    cwd: __dirname + '/..',
    stdio: 'inherit',
  });
};
