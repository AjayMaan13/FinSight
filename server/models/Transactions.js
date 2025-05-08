// models/Transactions.js
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false,
    },
    // Add any additional fields you need
  });
  
  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });
  };
  
  return Transaction;
};