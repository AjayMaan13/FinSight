const request = require('supertest');
const app = require('../app');
const db = require('../models');

// Wipes all app tables between tests so each test starts from a clean slate.
// Order matters: children before parents to satisfy FK constraints.
async function resetDB() {
  await db.Transaction.destroy({ where: {}, force: true });
  await db.Goal.destroy({ where: {}, force: true });
  await db.Budget.destroy({ where: {}, force: true });
  await db.User.destroy({ where: {}, force: true });
}

// Registers a fresh user through the real HTTP API (not a direct model
// create) and returns the token + user, so tests exercise the exact same
// path a real client would.
async function registerAndLogin(overrides = {}) {
  const user = {
    firstName: 'Test',
    lastName: 'User',
    email: `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
    password: 'password123',
    ...overrides,
  };

  const res = await request(app).post('/api/auth/register').send(user);
  return { token: res.body.token, user: res.body.user, plainPassword: user.password, res };
}

module.exports = { app, db, resetDB, registerAndLogin };
