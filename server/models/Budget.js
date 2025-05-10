'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    static associate(models) {
      Budget.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }

    // Calculate remaining budget
    calculateRemaining(currentSpent) {
      return this.amount - currentSpent;
    }

    // Check if budget is exceeded
    isExceeded(currentSpent) {
      return currentSpent > this.amount;
    }

    // Get percentage spent
    getPercentageSpent(currentSpent) {
      if (this.amount === 0) return 0;
      return Math.round((currentSpent / this.amount) * 100);
    }
  }

  Budget.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Category is required'
        }
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: {
          args: [0.01],
          msg: 'Budget amount must be greater than 0'
        }
      }
    },
    period: {
      type: DataTypes.ENUM('weekly', 'monthly', 'yearly'),
      allowNull: false,
      defaultValue: 'monthly',
      validate: {
        isIn: [['weekly', 'monthly', 'yearly']]
      }
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    alertThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: 80,
      validate: {
        min: 0,
        max: 100
      },
      comment: 'Percentage of budget that triggers an alert'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Budget',
    tableName: 'budgets',
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['category']
      },
      {
        fields: ['period']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  return Budget;
};