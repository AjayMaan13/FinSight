const request = require('supertest');
const { app, db, resetDB, registerAndLogin } = require('./helpers');

afterEach(async () => {
  await resetDB();
});

afterAll(async () => {
  await db.sequelize.close();
});

async function createBudget(token, overrides = {}) {
  return request(app)
    .post('/api/budgets')
    .set('Authorization', `Bearer ${token}`)
    .send({
      category: 'Food & Dining',
      amount: 500,
      period: 'monthly',
      ...overrides,
    });
}

describe('POST /api/budgets', () => {
  it('creates a budget for the authenticated user', async () => {
    const { token } = await registerAndLogin();
    const res = await createBudget(token);

    expect(res.status).toBe(201);
    expect(res.body.budget.category).toBe('Food & Dining');
    expect(res.body.budget.isActive).toBe(true);
  });

  it('rejects unauthenticated requests', async () => {
    const res = await request(app).post('/api/budgets').send({
      category: 'Food',
      amount: 100,
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/budgets', () => {
  it('only returns the authenticated user\'s budgets, with spent/remaining computed', async () => {
    const userA = await registerAndLogin();
    const userB = await registerAndLogin();
    await createBudget(userA.token, { category: 'Food & Dining', amount: 500 });
    await createBudget(userB.token, { category: 'Shopping', amount: 300 });

    // A real expense against userA's budget category.
    await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${userA.token}`)
      .send({
        amount: 120,
        description: 'Dinner out',
        category: 'Food & Dining',
        type: 'expense',
        date: new Date().toISOString().slice(0, 10),
      });

    const res = await request(app)
      .get('/api/budgets')
      .set('Authorization', `Bearer ${userA.token}`);

    expect(res.status).toBe(200);
    expect(res.body.budgets).toHaveLength(1);
    expect(res.body.budgets[0].category).toBe('Food & Dining');
    expect(res.body.budgets[0].spent).toBe(120);
    expect(res.body.budgets[0].remaining).toBe(380);
  });

  it('filters by period', async () => {
    const { token } = await registerAndLogin();
    await createBudget(token, { category: 'Food', period: 'monthly' });
    await createBudget(token, { category: 'Rent', period: 'yearly' });

    const res = await request(app)
      .get('/api/budgets?period=yearly')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.budgets).toHaveLength(1);
    expect(res.body.budgets[0].category).toBe('Rent');
  });
});

describe('PUT/DELETE /api/budgets/:id', () => {
  it('updates a budget owned by the user', async () => {
    const { token } = await registerAndLogin();
    const created = await createBudget(token);

    const res = await request(app)
      .put(`/api/budgets/${created.body.budget.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 750 });

    expect(res.status).toBe(200);
    expect(Number(res.body.budget.amount)).toBe(750);
  });

  it('returns 404 when updating another user\'s budget', async () => {
    const owner = await registerAndLogin();
    const attacker = await registerAndLogin();
    const created = await createBudget(owner.token);

    const res = await request(app)
      .put(`/api/budgets/${created.body.budget.id}`)
      .set('Authorization', `Bearer ${attacker.token}`)
      .send({ amount: 1 });

    expect(res.status).toBe(404);
  });

  it('deletes a budget owned by the user', async () => {
    const { token } = await registerAndLogin();
    const created = await createBudget(token);

    const del = await request(app)
      .delete(`/api/budgets/${created.body.budget.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(200);

    const getAll = await request(app)
      .get('/api/budgets')
      .set('Authorization', `Bearer ${token}`);
    expect(getAll.body.budgets).toHaveLength(0);
  });
});
