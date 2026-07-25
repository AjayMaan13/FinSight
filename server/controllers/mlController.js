// controllers/mlController.js
// Bridges the Node API and the Python ML microservice. Pulls the authenticated
// user's transactions (and budgets) from Postgres, forwards them to the Flask
// ML service, and returns the predictions. Fails gracefully if ML is down.

const { Transaction, Budget } = require('../models');

// Some hosts (e.g. Render's fromService "hostport") provide a bare
// "host:port" with no scheme; normalize it to a full URL either way.
const rawMlUrl = process.env.ML_SERVICE_URL || 'http://localhost:5002';
const ML_SERVICE_URL = /^https?:\/\//.test(rawMlUrl) ? rawMlUrl : `http://${rawMlUrl}`;
const ML_TIMEOUT_MS = 8000;

// Fetch all of a user's transactions in ML-friendly shape.
async function loadTransactions(userId) {
  const rows = await Transaction.findAll({
    where: { userId },
    order: [['date', 'ASC']],
  });
  return rows.map((t) => ({
    id: t.id,
    amount: Number(t.amount),
    type: t.type,
    category: t.category,
    date: t.date,
    description: t.description,
  }));
}

async function loadBudgets(userId) {
  const rows = await Budget.findAll({ where: { userId, isActive: true } });
  return rows.map((b) => ({
    category: b.category,
    amount: Number(b.amount),
    period: b.period,
  }));
}

// POST to the ML service with a timeout.
async function callML(path, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ML_TIMEOUT_MS);
  try {
    const res = await fetch(`${ML_SERVICE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`ML service ${res.status}: ${text}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function handleMLError(res, error) {
  console.error('ML service error:', error.message);
  const unavailable =
    error.name === 'AbortError' ||
    error.cause?.code === 'ECONNREFUSED' ||
    /fetch failed/i.test(error.message);
  if (unavailable) {
    return res.status(503).json({
      success: false,
      error: 'ML service unavailable',
    });
  }
  return res.status(500).json({ success: false, error: error.message });
}

exports.getForecast = async (req, res) => {
  try {
    const transactions = await loadTransactions(req.user.id);
    const days = parseInt(req.query.days, 10) || 30;
    const data = await callML('/forecast', { transactions, days });
    res.json(data);
  } catch (error) {
    handleMLError(res, error);
  }
};

exports.getAnomalies = async (req, res) => {
  try {
    const transactions = await loadTransactions(req.user.id);
    const contamination = parseFloat(req.query.contamination) || 0.05;
    const data = await callML('/anomaly', { transactions, contamination });
    res.json(data);
  } catch (error) {
    handleMLError(res, error);
  }
};

exports.getInsights = async (req, res) => {
  try {
    const [transactions, budgets] = await Promise.all([
      loadTransactions(req.user.id),
      loadBudgets(req.user.id),
    ]);
    const data = await callML('/insights', { transactions, budgets });
    res.json(data);
  } catch (error) {
    handleMLError(res, error);
  }
};
