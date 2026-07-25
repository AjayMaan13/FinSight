'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Associate budgets with the first seeded user
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users LIMIT 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No users found. Please run user seeder first.');
      return;
    }

    const userId = users[0].id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const budgets = [
      { category: 'Food & Dining', amount: 600.00, alert_threshold: 80 },
      { category: 'Transportation', amount: 250.00, alert_threshold: 80 },
      { category: 'Shopping', amount: 400.00, alert_threshold: 75 },
      { category: 'Utilities', amount: 300.00, alert_threshold: 90 },
      { category: 'Entertainment', amount: 200.00, alert_threshold: 70 }
    ].map((b) => ({
      id: uuidv4(),
      category: b.category,
      amount: b.amount,
      period: 'monthly',
      start_date: startOfMonth,
      end_date: null,
      is_active: true,
      alert_threshold: b.alert_threshold,
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date()
    }));

    return queryInterface.bulkInsert('budgets', budgets, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('budgets', null, {});
  }
};
