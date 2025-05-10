'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get a user to associate transactions with
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users LIMIT 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (users.length === 0) {
      console.log('No users found. Please run user seeder first.');
      return;
    }
    
    const userId = users[0].id;
    const today = new Date();
    
    const transactions = [
      {
        id: uuidv4(),
        amount: 3500.00,
        description: 'Monthly Salary',
        category: 'Salary',
        type: 'income',
        date: new Date(today.getFullYear(), today.getMonth(), 1),
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        amount: 1200.00,
        description: 'Rent Payment',
        category: 'Housing',
        type: 'expense',
        date: new Date(today.getFullYear(), today.getMonth(), 5),
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        amount: 150.00,
        description: 'Grocery Shopping',
        category: 'Food',
        type: 'expense',
        date: new Date(today.getFullYear(), today.getMonth(), 10),
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        amount: 50.00,
        description: 'Coffee Shop',
        category: 'Food',
        type: 'expense',
        date: new Date(today.getFullYear(), today.getMonth(), 15),
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    return queryInterface.bulkInsert('transactions', transactions, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('transactions', null, {});
  }
};