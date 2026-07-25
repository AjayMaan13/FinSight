const request = require('supertest');
const { app, db, resetDB } = require('./helpers');

afterEach(async () => {
  await resetDB();
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('POST /api/auth/register', () => {
  it('creates a user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('ada@example.com');
    expect(res.body.user.password).toBeUndefined();
  });

  it('rejects duplicate emails', async () => {
    await request(app).post('/api/auth/register').send({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Ada',
      lastName: 'Copy',
      email: 'ada@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects invalid input (missing fields, short password)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: '',
      email: 'not-an-email',
      password: '123',
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with the password used at registration', async () => {
    await request(app).post('/api/auth/register').send({
      firstName: 'Grace',
      lastName: 'Hopper',
      email: 'grace@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'grace@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('rejects a wrong password', async () => {
    await request(app).post('/api/auth/register').send({
      firstName: 'Grace',
      lastName: 'Hopper',
      email: 'grace@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'grace@example.com',
      password: 'wrong-password',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects a nonexistent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns the current user when authenticated', async () => {
    const register = await request(app).post('/api/auth/register').send({
      firstName: 'Grace',
      lastName: 'Hopper',
      email: 'grace@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${register.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('grace@example.com');
  });

  it('rejects requests without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects requests with an invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });
});
