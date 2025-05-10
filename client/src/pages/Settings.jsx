// src/pages/Settings.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const { user } = useContext(AuthContext);
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    monthly: true,
    weekly: false,
    transactions: true,
    goals: true
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showActivity: false,
    allowAnalytics: true
  });

  // Currency preferences
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = (section) => {
    // In a real app, you'd save these settings to the backend
    alert(`${section} settings saved successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Account Information */}
        <div className="bg-gray-800 rounded-lg shadow p-6 mb-6 border border-gray-700">
          <h2 className="text-lg font-medium text-white mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Name</label>
              <p className="mt-1 text-sm text-white">{`${user?.firstName || ''} ${user?.lastName || ''}`}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <p className="mt-1 text-sm text-white">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Member Since</label>
              <p className="mt-1 text-sm text-white">January 2025</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-gray-800 rounded-lg shadow p-6 mb-6 border border-gray-700">
          <h2 className="text-lg font-medium text-white mb-4">Preferences</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-300">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-300">
                Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-300">
                Theme
              </label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => handleSaveSettings('Preferences')}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-800 rounded-lg shadow p-6 mb-6 border border-gray-700">
          <h2 className="text-lg font-medium text-white mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Email Notifications</p>
                <p className="text-xs text-gray-400">Receive notifications via email</p>
              </div>
              <button
                onClick={() => handleNotificationChange('email')}
                className={`${
                  notifications.email ? 'bg-blue-600' : 'bg-gray-600'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    notifications.email ? 'translate-x-5' : 'translate-x-0'
                  } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Browser Notifications</p>
                <p className="text-xs text-gray-400">Receive notifications in your browser</p>
              </div>
              <button
                onClick={() => handleNotificationChange('browser')}
                className={`${
                  notifications.browser ? 'bg-blue-600' : 'bg-gray-600'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    notifications.browser ? 'translate-x-5' : 'translate-x-0'
                  } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Transaction Alerts</p>
                <p className="text-xs text-gray-400">Get notified about new transactions</p>
              </div>
              <button
                onClick={() => handleNotificationChange('transactions')}
                className={`${
                  notifications.transactions ? 'bg-blue-600' : 'bg-gray-600'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    notifications.transactions ? 'translate-x-5' : 'translate-x-0'
                  } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Goal Updates</p>
                <p className="text-xs text-gray-400">Get notified about goal progress</p>
              </div>
              <button
                onClick={() => handleNotificationChange('goals')}
                className={`${
                  notifications.goals ? 'bg-blue-600' : 'bg-gray-600'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    notifications.goals ? 'translate-x-5' : 'translate-x-0'
                  } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => handleSaveSettings('Notifications')}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Notification Settings
            </button>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-gray-800 rounded-lg shadow p-6 mb-6 border border-gray-700">
          <h2 className="text-lg font-medium text-white mb-4">Privacy Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Show Profile</p>
                <p className="text-xs text-gray-400">Make your profile visible to others</p>
              </div>
              <button
                onClick={() => handlePrivacyChange('showProfile')}
                className={`${
                  privacy.showProfile ? 'bg-blue-600' : 'bg-gray-600'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    privacy.showProfile ? 'translate-x-5' : 'translate-x-0'
                  } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Show Activity</p>
                <p className="text-xs text-gray-400">Let others see your activity</p>
              </div>
              <button
                onClick={() => handlePrivacyChange('showActivity')}
                className={`${
                  privacy.showActivity ? 'bg-blue-600' : 'bg-gray-600'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    privacy.showActivity ? 'translate-x-5' : 'translate-x-0'
                  } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Analytics</p>
                <p className="text-xs text-gray-400">Help us improve by sharing analytics</p>
              </div>
              <button
                onClick={() => handlePrivacyChange('allowAnalytics')}
                className={`${
                  privacy.allowAnalytics ? 'bg-blue-600' : 'bg-gray-600'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    privacy.allowAnalytics ? 'translate-x-5' : 'translate-x-0'
                  } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => handleSaveSettings('Privacy')}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Privacy Settings
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gray-800 rounded-lg shadow p-6 border border-red-700">
          <h2 className="text-lg font-medium text-red-400 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white">Delete Account</h3>
              <p className="text-sm text-gray-400 mt-1">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;