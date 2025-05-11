const { Goal } = require('../models');
const { Op } = require('sequelize');

// Get all goals for the authenticated user
exports.getGoals = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    
    const whereClause = { userId: req.user.id };
    
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (priority) whereClause.priority = priority;
    
    const goals = await Goal.findAll({
      where: whereClause,
      order: [['targetDate', 'ASC']],
    });
    
    res.json({
      success: true,
      count: goals.length,
      goals
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch goals' 
    });
  }
};

// Get a single goal
exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!goal) {
      return res.status(404).json({ 
        success: false,
        message: 'Goal not found' 
      });
    }
    
    res.json({
      success: true,
      goal
    });
  } catch (error) {
    console.error('Error fetching goal:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch goal' 
    });
  }
};

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    const { name, description, targetAmount, targetDate, category, priority, currentAmount } = req.body;
    
    const goal = await Goal.create({
      name,
      description,
      targetAmount,
      targetDate,
      category,
      priority,
      userId: req.user.id,
      currentAmount: currentAmount || 0,  // Allow currentAmount from request
      status: 'active'
    });
    
    res.status(201).json({
      success: true,
      goal
    });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create goal',
      error: error.message
    });
  }
};

// Update a goal
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!goal) {
      return res.status(404).json({ 
        success: false,
        message: 'Goal not found' 
      });
    }
    
    const updatedFields = {};
    const allowedFields = ['name', 'description', 'targetAmount', 'targetDate', 'category', 'priority', 'status', 'currentAmount'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updatedFields[field] = req.body[field];
      }
    });
    
    await goal.update(updatedFields);
    
    res.json({
      success: true,
      goal
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update goal' 
    });
  }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!goal) {
      return res.status(404).json({ 
        success: false,
        message: 'Goal not found' 
      });
    }
    
    await goal.destroy();
    
    res.json({ 
      success: true,
      message: 'Goal deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete goal' 
    });
  }
};

// Update goal progress
exports.updateGoalProgress = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (amount === undefined || amount < 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid amount provided' 
      });
    }
    
    const goal = await Goal.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!goal) {
      return res.status(404).json({ 
        success: false,
        message: 'Goal not found' 
      });
    }
    
    goal.currentAmount = amount;
    
    // Update status if goal is completed
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }
    
    await goal.save();
    
    res.json({
      success: true,
      goal,
      progress: goal.getProgress()
    });
  } catch (error) {
    console.error('Error updating goal progress:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update goal progress' 
    });
  }
};

// Get goal statistics
exports.getGoalStats = async (req, res) => {
  try {
    const goals = await Goal.findAll({
      where: { userId: req.user.id }
    });
    
    const stats = {
      total: goals.length,
      active: goals.filter(g => g.status === 'active').length,
      completed: goals.filter(g => g.status === 'completed').length,
      cancelled: goals.filter(g => g.status === 'cancelled').length,
      totalTargetAmount: goals.reduce((sum, g) => sum + parseFloat(g.targetAmount), 0),
      totalCurrentAmount: goals.reduce((sum, g) => sum + parseFloat(g.currentAmount), 0),
      overallProgress: goals.length ? 
        Math.round((goals.reduce((sum, g) => sum + g.getProgress(), 0) / goals.length)) : 0
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching goal stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch goal statistics' 
    });
  }
};