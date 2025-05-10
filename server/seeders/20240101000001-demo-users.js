'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    return queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'user',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      id: uuidv4(),
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      role: 'user',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};