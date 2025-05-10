'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, get a user ID to associate goals with
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users LIMIT 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (users.length === 0) {
      console.log('No users found. Please run user seeder first.');
      return;
    }
    
    const userId = users[0].id;
    const currentDate = new Date();
    
    const goals = [
      {
        id: uuidv4(),
        name: 'Emergency Fund',
        description: 'Build an emergency fund equal to 6 months of expenses',
        target_amount: 15000.00,
        current_amount: 5000.00,
        target_date: new Date(currentDate.getFullYear() + 1, 5, 30),
        category: 'Savings',
        priority: 'high',
        status: 'active',
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Vacation Fund',
        description: 'Save for summer vacation to Europe',
        target_amount: 3000.00,
        current_amount: 800.00,
        target_date: new Date(currentDate.getFullYear() + 1, 6, 15),
        category: 'Travel',
        priority: 'medium',
        status: 'active',
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'New Laptop',
        description: 'Save for a new MacBook Pro',
        target_amount: 2500.00,
        current_amount: 1200.00,
        target_date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 6, 1),
        category: 'Technology',
        priority: 'low',
        status: 'active',
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    return queryInterface.bulkInsert('goals', goals, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('goals', null, {});
  }
};