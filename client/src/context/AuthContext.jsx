import { createContext, useState, useEffect, useContext } from 'react';
import api, { authAPI, transactionAPI, goalAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set token in axios headers and localStorage
  const setAuthToken = (newToken) => {
  if (newToken) {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    // Update the default header for all API instances
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  } else {
    localStorage.removeItem('token');
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
  }
};

  // Load user if token exists
  const loadUser = async () => {
    if (token) {
      setAuthToken(token);
      
      try {
        const res = await authAPI.getCurrentUser();
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error loading user:', err);
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setAuthToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  };

  // Login function
  const login = async (formData) => {
    try {
      setError(null);
      
      const res = await api.post('/auth/login', formData);
      
      setAuthToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (formData) => {
    try {
      setError(null);
      
      const res = await api.post('/auth/register', formData);
      
      setAuthToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      setError(null);
      
      const res = await api.put('/users/profile', formData);
      const updatedUser = res.data.user;
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Initialize: load user on first render
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};