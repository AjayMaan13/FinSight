'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the enum type for transaction types
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_transactions_type" AS ENUM ('income', 'expense');
    `).catch(() => {
      // Type might already exist
    });

    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('income', 'expense'),
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
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
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
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
    await queryInterface.addIndex('transactions', ['user_id']);
    await queryInterface.addIndex('transactions', ['date']);
    await queryInterface.addIndex('transactions', ['category']);
    await queryInterface.addIndex('transactions', ['type']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transactions');
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_transactions_type";
    `);
  }
};