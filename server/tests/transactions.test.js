const request = require('supertest');
const { app, db, resetDB, registerAndLogin } = require('./helpers');

afterEach(async () => {
  await resetDB();
});

afterAll(async () => {
  await db.sequelize.close();
});

async function createTransaction(token, overrides = {}) {
  return request(app)
    .post('/api/transactions')
    .set('Authorization', `Bearer ${token}`)
    .send({
      amount: 42.5,
      description: 'Groceries',
      category: 'Food & Dining',
      type: 'expense',
      date: '2026-01-15',
      ...overrides,
    });
}

describe('POST /api/transactions', () => {
  it('creates a transaction for the authenticated user', async () => {
    const { token } = await registerAndLogin();
    const res = await createTransaction(token);

    expect(res.status).toBe(201);
    expect(res.body.amount).toBe('42.50');
    expect(res.body.category).toBe('Food & Dining');
  });

  it('rejects unauthenticated requests', async () => {
    const res = await request(app).post('/api/transactions').send({
      amount: 10,
      description: 'x',
      category: 'x',
      type: 'expense',
    });
    expect(res.status).toBe(401);
  });

  it('rejects invalid input', async () => {
    const { token } = await registerAndLogin();
    const res = await createTransaction(token, { amount: -5, type: 'not-a-type' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe('GET /api/transactions', () => {
  it('only returns the authenticated user\'s transactions', async () => {
    const userA = await registerAndLogin();
    const userB = await registerAndLogin();

    await createTransaction(userA.token, { description: 'A tx' });
    await createTransaction(userB.token, { description: 'B tx' });

    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${userA.token}`);

    expect(res.status).toBe(200);
    expect(res.body.transactions).toHaveLength(1);
    expect(res.body.transactions[0].description).toBe('A tx');
  });

  it('filters by type', async () => {
    const { token } = await registerAndLogin();
    await createTransaction(token, { type: 'expense', description: 'Expense one' });
    await createTransaction(token, {
      type: 'income',
      description: 'Income one',
      category: 'Salary',
    });

    const res = await request(app)
      .get('/api/transactions?type=income')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.transactions).toHaveLength(1);
    expect(res.body.transactions[0].type).toBe('income');
  });
});

describe('PUT/DELETE /api/transactions/:id', () => {
  it('updates a transaction owned by the user', async () => {
    const { token } = await registerAndLogin();
    const created = await createTransaction(token);

    const res = await request(app)
      .put(`/api/transactions/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 99.99, description: 'Updated', category: 'Food', type: 'expense' });

    expect(res.status).toBe(200);
    expect(Number(res.body.amount)).toBe(99.99);
  });

  it('returns 404 when updating another user\'s transaction', async () => {
    const owner = await registerAndLogin();
    const attacker = await registerAndLogin();
    const created = await createTransaction(owner.token);

    const res = await request(app)
      .put(`/api/transactions/${created.body.id}`)
      .set('Authorization', `Bearer ${attacker.token}`)
      .send({ amount: 1, description: 'x', category: 'x', type: 'expense' });

    expect(res.status).toBe(404);
  });

  it('deletes a transaction owned by the user', async () => {
    const { token } = await registerAndLogin();
    const created = await createTransaction(token);

    const del = await request(app)
      .delete(`/api/transactions/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(200);

    const getAll = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`);
    expect(getAll.body.transactions).toHaveLength(0);
  });
});

describe('GET /api/transactions/summary', () => {
  it('summarizes income vs expense for the authenticated user', async () => {
    const { token } = await registerAndLogin();
    await createTransaction(token, { type: 'income', amount: 1000, category: 'Salary' });
    await createTransaction(token, { type: 'expense', amount: 300, category: 'Food' });

    const res = await request(app)
      .get('/api/transactions/summary')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totalIncome).toBe(1000);
    expect(res.body.totalExpenses).toBe(300);
    expect(res.body.balance).toBe(700);
  });
});
