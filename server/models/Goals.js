'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Goal extends Model {
    static associate(models) {
      Goal.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }

    // Calculate progress percentage
    getProgress() {
      if (this.targetAmount === 0) return 0;
      return Math.min(Math.round((this.currentAmount / this.targetAmount) * 100), 100);
    }

    // Check if goal is completed
    isCompleted() {
      return this.currentAmount >= this.targetAmount;
    }

    // Check if goal is overdue
    isOverdue() {
      return new Date() > new Date(this.targetDate) && !this.isCompleted();
    }
  }

  Goal.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Goal name is required'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    targetAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: {
          args: [0.01],
          msg: 'Target amount must be greater than 0'
        }
      }
    },
    currentAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        isDecimal: true,
        min: 0
      }
    },
    targetDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: {
          args: [new Date().toISOString().split('T')[0]],
          msg: 'Target date must be in the future'
        }
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'General'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
      validate: {
        isIn: [['low', 'medium', 'high']]
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'cancelled'),
      defaultValue: 'active'
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
    modelName: 'Goal',
    tableName: 'goals',
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['targetDate']
      },
      {
        fields: ['status']
      }
    ]
  });

  return Goal;
};