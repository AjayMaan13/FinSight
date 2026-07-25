const request = require('supertest');
const { app, db, resetDB, registerAndLogin } = require('./helpers');

afterEach(async () => {
  await resetDB();
});

afterAll(async () => {
  await db.sequelize.close();
});

async function createGoal(token, overrides = {}) {
  return request(app)
    .post('/api/goals')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Emergency Fund',
      targetAmount: 5000,
      targetDate: '2027-01-01',
      category: 'Savings',
      priority: 'high',
      ...overrides,
    });
}

describe('POST /api/goals', () => {
  it('creates a goal for the authenticated user', async () => {
    const { token } = await registerAndLogin();
    const res = await createGoal(token);

    expect(res.status).toBe(201);
    expect(res.body.goal.name).toBe('Emergency Fund');
    expect(res.body.goal.status).toBe('active');
  });

  it('rejects invalid input (missing target date)', async () => {
    const { token } = await registerAndLogin();
    const res = await createGoal(token, { targetDate: undefined });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/goals', () => {
  it('only returns the authenticated user\'s goals', async () => {
    const userA = await registerAndLogin();
    const userB = await registerAndLogin();
    await createGoal(userA.token, { name: 'A goal' });
    await createGoal(userB.token, { name: 'B goal' });

    const res = await request(app)
      .get('/api/goals')
      .set('Authorization', `Bearer ${userA.token}`);

    expect(res.status).toBe(200);
    expect(res.body.goals).toHaveLength(1);
    expect(res.body.goals[0].name).toBe('A goal');
  });
});

describe('PUT /api/goals/:id/progress', () => {
  it('updates progress and marks the goal completed at target', async () => {
    const { token } = await registerAndLogin();
    const created = await createGoal(token, { targetAmount: 1000 });

    const res = await request(app)
      .put(`/api/goals/${created.body.goal.id}/progress`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 1000 });

    expect(res.status).toBe(200);
    expect(res.body.goal.status).toBe('completed');
    expect(res.body.progress).toBe(100);
  });

  it('rejects a negative amount', async () => {
    const { token } = await registerAndLogin();
    const created = await createGoal(token);

    const res = await request(app)
      .put(`/api/goals/${created.body.goal.id}/progress`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: -10 });

    expect(res.status).toBe(400);
  });

  it('returns 404 for another user\'s goal', async () => {
    const owner = await registerAndLogin();
    const attacker = await registerAndLogin();
    const created = await createGoal(owner.token);

    const res = await request(app)
      .put(`/api/goals/${created.body.goal.id}/progress`)
      .set('Authorization', `Bearer ${attacker.token}`)
      .send({ amount: 100 });

    expect(res.status).toBe(404);
  });
});

describe('GET /api/goals/stats', () => {
  it('aggregates goal statistics for the authenticated user', async () => {
    const { token } = await registerAndLogin();
    await createGoal(token, { name: 'Goal 1', targetAmount: 1000 });
    await createGoal(token, { name: 'Goal 2', targetAmount: 2000 });

    const res = await request(app)
      .get('/api/goals/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.stats.total).toBe(2);
    expect(res.body.stats.active).toBe(2);
    expect(res.body.stats.totalTargetAmount).toBe(3000);
  });
});

describe('DELETE /api/goals/:id', () => {
  it('deletes a goal owned by the user', async () => {
    const { token } = await registerAndLogin();
    const created = await createGoal(token);

    const del = await request(app)
      .delete(`/api/goals/${created.body.goal.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(200);

    const getAll = await request(app)
      .get('/api/goals')
      .set('Authorization', `Bearer ${token}`);
    expect(getAll.body.goals).toHaveLength(0);
  });
});
