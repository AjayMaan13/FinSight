// src/components/transactions/ImportTransactions.jsx
import { useState } from 'react';
import Papa from 'papaparse';
import { importFromCSV } from '../../services/api';

const ImportTransactions = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Validate and format the data
        const formattedData = results.data.map(row => ({
          amount: parseFloat(row.amount || 0),
          description: row.description || '',
          date: row.date || new Date().toISOString().split('T')[0],
          category: row.category || 'Uncategorized',
          type: (row.type || 'expense').toLowerCase()
        }));
        
        setPreview(formattedData.slice(0, 5)); // Show only first 5 rows
        setShowPreview(true);
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
      }
    });
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a CSV file first');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Parse the entire file
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            // Validate and format the data
            const transactions = results.data.map(row => ({
              amount: parseFloat(row.amount || 0),
              description: row.description || '',
              date: row.date || new Date().toISOString().split('T')[0],
              category: row.category || 'Uncategorized',
              type: (row.type || 'expense').toLowerCase()
            }));
            
            // Send to API
            await importFromCSV({ transactions });
            
            if (onSuccess) onSuccess();
            setFile(null);
            setShowPreview(false);
            alert(`Successfully imported ${transactions.length} transactions`);
          } catch (err) {
            setError(err.response?.data?.error || 'Failed to import transactions');
          } finally {
            setLoading(false);
          }
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`);
          setLoading(false);
        }
      });
    } catch  {
      setError('Error processing file');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">Import Transactions</h3>
      
      {error && (
        <div className="bg-red-900 text-red-300 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select CSV File
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-gray-700 file:text-gray-300
            hover:file:bg-gray-600"
        />
        <p className="mt-2 text-sm text-gray-400">
          CSV should have headers: amount, description, date, category, type
        </p>
      </div>
      
      {showPreview && preview.length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-medium text-white mb-2">Preview</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase">Description</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase">Amount</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase">Category</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase">Type</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {preview.map((row, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-white">{row.description}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-white">{row.amount}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-white">{row.date}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-white">{row.category}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-white">{row.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Showing first 5 rows. Total rows may be more.
          </p>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleImport}
          disabled={!file || loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Importing...' : 'Import Transactions'}
        </button>
      </div>
      
      <div className="mt-4">
        <h4 className="text-lg font-medium text-white mb-2">CSV Format Example</h4>
        <div className="bg-gray-900 p-3 rounded text-xs font-mono text-gray-300 overflow-auto">
          amount,description,date,category,type<br />
          45.67,Grocery Shopping,2025-05-01,Groceries,expense<br />
          1500.00,Paycheck,2025-05-05,Salary,income<br />
          120.50,Electric Bill,2025-05-10,Utilities,expense
        </div>
      </div>
    </div>
  );
};

export default ImportTransactions;