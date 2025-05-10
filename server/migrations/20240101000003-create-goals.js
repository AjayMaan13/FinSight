'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create enum types
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_goals_priority" AS ENUM ('low', 'medium', 'high');
    `).catch(() => {});
    
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_goals_status" AS ENUM ('active', 'completed', 'cancelled');
    `).catch(() => {});

    await queryInterface.createTable('goals', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      target_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      current_amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      target_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'General'
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
      },
      status: {
        type: Sequelize.ENUM('active', 'completed', 'cancelled'),
        defaultValue: 'active'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('goals', ['user_id']);
    await queryInterface.addIndex('goals', ['target_date']);
    await queryInterface.addIndex('goals', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('goals');
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_goals_priority";
    `);
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_goals_status";
    `);
  }
};