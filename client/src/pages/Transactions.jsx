// src/pages/Transactions.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateTransaction } from '../services/api';
//import { getTransactions, deleteTransaction, updateTransaction } from '../services/api';
import ImportTransactions from '../components/transactions/ImportTransactions';
import TransactionForm from '../components/transactions/TransactionForm';

const TransactionEditModal = ({ transaction, onClose, onSave }) => {
  const [form, setForm] = useState({
    amount: transaction.amount,
    description: transaction.description,
    date: new Date(transaction.date).toISOString().split('T')[0],
    category: transaction.category,
    type: transaction.type
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const formattedData = {
        ...form,
        amount: parseFloat(form.amount)
      };
      
      await updateTransaction(transaction.id, formattedData);
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Edit Transaction</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && <div className="bg-red-900 text-red-300 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-300">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                step="0.01"
                min="0.01"
              />
            </div>
            
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-300">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-300">Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-300">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  /*
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  */
  const [setPage] = useState(1);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    type: '',
    sort: 'date',
    order: 'DESC'
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('list');

  // Store all transactions separately for local filtering
  const [allTransactions, setAllTransactions] = useState([]);
  
  // Initialize with some demo data if needed
  useEffect(() => {
    // Demo data
    const demoTransactions = [
      { id: 1, description: 'Coffee Shop', amount: 4.50, date: '2025-05-07', category: 'Food & Drink', type: 'expense' },
      { id: 2, description: 'Paycheck', amount: 2500.00, date: '2025-05-01', category: 'Income', type: 'income' },
      { id: 3, description: 'Electric Bill', amount: 95.20, date: '2025-05-03', category: 'Utilities', type: 'expense' },
      { id: 4, description: 'Grocery Store', amount: 65.75, date: '2025-05-05', category: 'Groceries', type: 'expense' },
      { id: 5, description: 'Online Shopping', amount: 39.99, date: '2025-05-06', category: 'Shopping', type: 'expense' },
    ];

    setAllTransactions(demoTransactions);
    setTransactions(demoTransactions);
    setLoading(false);
    
    // Extract categories
    const uniqueCategories = [...new Set(demoTransactions.map(t => t.category))];
    setCategories(uniqueCategories);
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // For now, just use demo data
      // In a real app, you'd make an API call here
      setTransactions(allTransactions);
      setLoading(false);
    } catch (err) {
      setError('Failed to load transactions');
      console.error('Transaction fetch error:', err);
      setTransactions([]);
      setLoading(false);
    }
  };

  // Filter transactions locally when filters change
  useEffect(() => {
    let filtered = [...allTransactions];
    
    // Apply filters
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }
    if (filters.startDate) {
      filtered = filtered.filter(t => t.date >= filters.startDate);
    }
    if (filters.endDate) {
      filtered = filtered.filter(t => t.date <= filters.endDate);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (filters.sort) {
        case 'amount':
          aVal = a.amount;
          bVal = b.amount;
          break;
        case 'category':
          aVal = a.category;
          bVal = b.category;
          break;
        case 'description':
          aVal = a.description;
          bVal = b.description;
          break;
        case 'date':
        default:
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
      }
      
      if (filters.order === 'ASC') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    setTransactions(filtered);
  }, [filters, allTransactions]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sort: field,
      order: prev.sort === field && prev.order === 'ASC' ? 'DESC' : 'ASC'
    }));
  };

  const handleDeleteTransaction = async (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        // For demo, just remove from local state
        const updatedTransactions = allTransactions.filter(t => t.id !== id);
        setAllTransactions(updatedTransactions);
        setTransactions(updatedTransactions.filter(t => {
          // Apply current filters
          return (!filters.type || t.type === filters.type) &&
                 (!filters.category || t.category === filters.category) &&
                 (!filters.startDate || t.date >= filters.startDate) &&
                 (!filters.endDate || t.date <= filters.endDate);
        }));
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        alert('Failed to delete transaction');
      }
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  const closeEditModal = () => {
    setEditingTransaction(null);
  };

  const handleSaveEdit = () => {
    fetchTransactions();
    closeEditModal();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleAddTransaction = () => {
    fetchTransactions();
    setActiveTab('list');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Transactions</h1>
            <Link 
              to="/dashboard" 
              className="text-blue-400 hover:text-blue-300 flex items-center"
            >
              <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
          <p className="mt-1 text-sm text-gray-400">
            Manage and track all your financial transactions
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-700">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('list')}
              className={`${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
            >
              Transaction List
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`${
                activeTab === 'add'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
            >
              Add Transaction
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`${
                activeTab === 'import'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Import Transactions
            </button>
          </nav>
        </div>

        {activeTab === 'list' ? (
          <>
            {/* Filters */}
            <div className="bg-gray-800 rounded-lg shadow p-6 mb-8 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Filter Transactions</h2>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300">Category</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300">Type</label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300">Sort By</label>
                  <select
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="category">Category</option>
                    <option value="description">Description</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300">Order</label>
                  <select
                    name="order"
                    value={filters.order}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="DESC">Descending</option>
                    <option value="ASC">Ascending</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setFilters({
                    startDate: '',
                    endDate: '',
                    category: '',
                    type: '',
                    sort: 'date',
                    order: 'DESC'
                  })}
                  className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">All Transactions</h2>
                
                {loading ? (
                  <div className="text-center py-8">
                    <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-400">Loading transactions...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-900 text-red-300 p-3 rounded mb-4">
                    {error}
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="h-12 w-12 text-gray-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-400 mb-2">No transactions found</p>
                    <p className="text-gray-500 text-sm">Try adjusting your filters or add a new transaction</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-700">
                        <tr>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            onClick={() => handleSort('amount')}
                          >
                            <div className="flex items-center">
                              Amount
                              {filters.sort === 'amount' && (
                                <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={filters.order === 'ASC' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                                </svg>
                              )}
                            </div>
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {transaction.category}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <button 
                                onClick={() => handleEditTransaction(transaction)} 
                                className="text-blue-400 hover:text-blue-300 mr-3"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteTransaction(transaction.id)} 
                                className="text-red-400 hover:text-red-300"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : activeTab === 'add' ? (
          <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Transaction</h2>
            <TransactionForm onSuccess={handleAddTransaction} />
          </div>
        ) : (
          <ImportTransactions onSuccess={() => {
            fetchTransactions();
            setActiveTab('list');
          }} />
        )}
      </div>
      
      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <TransactionEditModal 
          transaction={editingTransaction}
          onClose={closeEditModal}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default Transactions;