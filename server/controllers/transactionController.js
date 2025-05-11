// controllers/transactionController.js
const { Transaction } = require('../models');
const { Op } = require('sequelize');;


// Get all transactions for the authenticated user
exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, startDate, endDate, category, type, sort = 'date', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = { userId: req.user.id };
    
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    if (category) whereClause.category = category;
    if (type) whereClause.type = type;
    
    const transactions = await Transaction.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, order]],
    });
    
    res.json({
      transactions: transactions.rows,
      totalCount: transactions.count,
      totalPages: Math.ceil(transactions.count / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Get a single transaction
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const { amount, description, date, category, type } = req.body;
    
    const transaction = await Transaction.create({
      amount,
      description,
      date: date || new Date(),
      category,
      type,
      userId: req.user.id
    });
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { amount, description, date, category, type } = req.body;
    
    const transaction = await Transaction.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    await transaction.update({
      amount: amount || transaction.amount,
      description: description || transaction.description,
      date: date || transaction.date,
      category: category || transaction.category,
      type: type || transaction.type
    });
    
    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    await transaction.destroy();
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

// Get transaction summary
exports.getTransactionSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereClause = { userId: req.user.id };
    
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    // Get total income
    const income = await Transaction.sum('amount', {
      where: { 
        ...whereClause,
        type: 'income'
      }
    }) || 0;
    
    // Get total expenses
    const expenses = await Transaction.sum('amount', {
      where: { 
        ...whereClause,
        type: 'expense'
      }
    }) || 0;
    
    res.json({
      totalIncome: parseFloat(income),
      totalExpenses: parseFloat(expenses),
      balance: parseFloat(income) - parseFloat(expenses),
    });
  } catch (error) {
    console.error('Error getting transaction summary:', error);
    res.status(500).json({ error: 'Failed to get transaction summary' });
  }
};

// Get monthly transaction trends
// controllers/transactionController.js
// Add to your existing file

const { sequelize } = require('../models');

// Get monthly transaction trends
exports.getMonthlyTrends = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    // SQL to get monthly totals
    const query = `
      SELECT 
        EXTRACT(MONTH FROM date) as month,
        type,
        SUM(amount) as total
      FROM "Transactions"
      WHERE 
        "userId" = :userId AND
        EXTRACT(YEAR FROM date) = :year
      GROUP BY EXTRACT(MONTH FROM date), type
      ORDER BY month
    `;
    
    const results = await sequelize.query(query, {
      replacements: { userId: req.user.id, year },
      type: sequelize.QueryTypes.SELECT
    });
    
    // Format the results into months
    const months = Array(12).fill().map((_, i) => i + 1);
    const formattedResults = months.map(month => {
      const income = results.find(r => r.month === month && r.type === 'income');
      const expense = results.find(r => r.month === month && r.type === 'expense');
      
      return {
        month,
        income: income ? parseFloat(income.total) : 0,
        expense: expense ? parseFloat(expense.total) : 0,
        balance: (income ? parseFloat(income.total) : 0) - (expense ? parseFloat(expense.total) : 0)
      };
    });
    
    res.json(formattedResults);
  } catch (error) {
    console.error('Error getting monthly trends:', error);
    res.status(500).json({ error: 'Failed to get monthly trends' });
  }
};

// Import transactions from CSV
exports.importFromCSV = async (req, res) => {
  try {
    const { transactions } = req.body;
    
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ error: 'Invalid transaction data format' });
    }
    
    // Validate and format each transaction
    const formattedTransactions = transactions.map(t => ({
      amount: parseFloat(t.amount),
      description: t.description,
      date: new Date(t.date),
      category: t.category,
      type: t.type.toLowerCase(),
      userId: req.user.id
    }));
    
    // Bulk create transactions
    await Transaction.bulkCreate(formattedTransactions);
    
    res.status(201).json({ 
      message: `Successfully imported ${formattedTransactions.length} transactions` 
    });
  } catch (error) {
    console.error('Error importing transactions:', error);
    res.status(500).json({ error: 'Failed to import transactions' });
  }
};