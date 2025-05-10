// src/components/goals/GoalList.jsx
const GoalList = ({ goals, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getProgress = (goal) => {
    return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-900 text-red-300',
      medium: 'bg-yellow-900 text-yellow-300',
      low: 'bg-green-900 text-green-300'
    };
    return colors[priority] || 'bg-gray-700 text-gray-300';
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Goal
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Progress
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Target Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Priority
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {goals.map((goal) => {
              const progress = getProgress(goal);
              const targetDate = new Date(goal.targetDate);
              const today = new Date();
              const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
              
              return (
                <tr key={goal.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-white">{goal.name}</div>
                        <div className="text-sm text-gray-400">{goal.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 mr-4">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                          <div
                            style={{ width: `${progress}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressColor(progress)}`}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-white font-medium">{progress}%</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatCurrency(goal.targetAmount - goal.currentAmount)} remaining
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{formatDate(goal.targetDate)}</div>
                    <div className={`text-sm ${daysRemaining < 30 ? 'text-red-400' : 'text-gray-400'}`}>
                      {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(goal.priority)}`}>
                      {goal.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(goal)}
                      className="text-blue-400 hover:text-blue-300 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(goal.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoalList;