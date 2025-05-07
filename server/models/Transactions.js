'use strict';

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    merchant: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isIncome: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    // Model options
    timestamps: true // Adds createdAt and updatedAt
  });
  
  // Associations
  Transaction.associate = function(models) {
    // Transaction belongs to a User
    Transaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };
  
  return Transaction;
};