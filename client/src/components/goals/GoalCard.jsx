// src/components/goals/GoalCard.jsx
const GoalCard = ({ goal, onEdit, onDelete }) => {
  const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
  const targetDate = new Date(goal.targetDate);
  const today = new Date();
  const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'savings':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'investment':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'debt':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'education':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-900 text-red-300';
      case 'medium':
        return 'bg-yellow-900 text-yellow-300';
      case 'low':
        return 'bg-green-900 text-green-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getProgressColor = () => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg bg-gray-700 text-white`}>
              {getCategoryIcon(goal.category)}
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-white truncate">{goal.name}</h3>
              <p className="text-sm text-gray-400">{goal.category}</p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
            {goal.priority}
          </span>
        </div>
        
        {goal.description && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{goal.description}</p>
        )}
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-white font-medium">{progress}%</span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
              <div
                style={{ width: `${progress}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressColor()}`}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Current</p>
              <p className="text-white font-medium">{formatCurrency(goal.currentAmount)}</p>
            </div>
            <div>
              <p className="text-gray-400">Target</p>
              <p className="text-white font-medium">{formatCurrency(goal.targetAmount)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Remaining</p>
              <p className="text-white font-medium">{formatCurrency(remainingAmount)}</p>
            </div>
            <div>
              <p className="text-gray-400">Time Left</p>
              <p className={`font-medium ${daysRemaining < 30 ? 'text-red-400' : 'text-white'}`}>
                {daysRemaining > 0 ? `${daysRemaining} days` : 'Overdue'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-700 px-5 py-3 flex justify-between">
        <button
          onClick={() => onEdit(goal)}
          className="text-sm font-medium text-blue-400 hover:text-blue-300"
        >
          Edit Goal
        </button>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-sm font-medium text-red-400 hover:text-red-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default GoalCard;