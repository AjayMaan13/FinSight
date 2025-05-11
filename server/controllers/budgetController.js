const { Budget, Transaction } = require('../models');
const { Op } = require('sequelize');

// Get all budgets for the authenticated user
exports.getBudgets = async (req, res) => {
  try {
    const { period, category, isActive } = req.query;
    
    const whereClause = { userId: req.user.id };
    
    if (period) whereClause.period = period;
    if (category) whereClause.category = category;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';
    
    const budgets = await Budget.findAll({
      where: whereClause,
      order: [['category', 'ASC']],
    });
    
    // Calculate spent amounts for each budget
    const budgetsWithSpent = await Promise.all(budgets.map(async (budget) => {
      const spent = await this.calculateSpentAmount(budget);
      return {
        ...budget.toJSON(),
        spent,
        remaining: budget.amount - spent,
        percentageSpent: budget.getPercentageSpent(spent)
      };
    }));
    
    res.json({
      success: true,
      count: budgetsWithSpent.length,
      budgets: budgetsWithSpent
    });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch budgets' 
    });
  }
};

// Calculate spent amount for a budget
exports.calculateSpentAmount = async (budget) => {
  const startDate = budget.startDate;
  let endDate = budget.endDate;
  
  if (!endDate) {
    // Calculate end date based on period
    endDate = new Date(startDate);
    switch (budget.period) {
      case 'weekly':
        endDate.setDate(endDate.getDate() + 7);
        break;
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }
  }
  
  const spent = await Transaction.sum('amount', {
    where: {
      userId: budget.userId,
      category: budget.category,
      type: 'expense',
      date: {
        [Op.between]: [startDate, endDate]
      }
    }
  });
  
  return spent || 0;
};

// Create a new budget
exports.createBudget = async (req, res) => {
  try {
    const { category, amount, period, startDate, alertThreshold } = req.body;
    
    const budget = await Budget.create({
      category,
      amount,
      period,
      startDate: startDate || new Date(),
      alertThreshold: alertThreshold || 80,
      userId: req.user.id,
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      budget
    });
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create budget',
      error: error.message
    });
  }
};

// Update a budget
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!budget) {
      return res.status(404).json({ 
        success: false,
        message: 'Budget not found' 
      });
    }
    
    const updatedFields = {};
    const allowedFields = ['category', 'amount', 'period', 'startDate', 'endDate', 'isActive', 'alertThreshold'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updatedFields[field] = req.body[field];
      }
    });
    
    await budget.update(updatedFields);
    
    res.json({
      success: true,
      budget
    });
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update budget' 
    });
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!budget) {
      return res.status(404).json({ 
        success: false,
        message: 'Budget not found' 
      });
    }
    
    await budget.destroy();
    
    res.json({ 
      success: true,
      message: 'Budget deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete budget' 
    });
  }
};