// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set token in axios headers and localStorage
  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Load user if token exists
  // src/context/AuthContext.jsx

// Update the loadUser function
const loadUser = async () => {
  if (token) {
    setAuthToken(token);
    
    try {
      // For now, use the user data from registration/login
      // This should be replaced with a real API call later
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Default mock user - update this with your actual name
        setUser({
          id: '123',
          firstName: 'Your', // Replace with your first name
          lastName: 'Name',  // Replace with your last name
          email: 'your.email@example.com'
        });
      }
      
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error loading user:', err);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setAuthToken(null);
    }
  }
  
  setLoading(false);
};

// Update the login function to store user data
const login = async (formData) => {
  try {
    setError(null);
    
    // Mock successful login - save user data
    const mockRes = {
      data: {
        token: 'mock-token-123',
        user: {
          id: '123',
          firstName: formData.email.split('@')[0], // Use email prefix as name
          lastName: 'User',
          email: formData.email
        }
      }
    };
    
    setToken(mockRes.data.token);
    setUser(mockRes.data.user);
    setIsAuthenticated(true);
    setAuthToken(mockRes.data.token);
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(mockRes.data.user));
    
    return { success: true };
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    return { success: false, error: err.response?.data?.message };
  }
};

// Update the register function similarly
const register = async (formData) => {
  try {
    setError(null);
    
    const mockRes = {
      data: {
        token: 'mock-token-123',
        user: {
          id: '123',
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        }
      }
    };
    
    setToken(mockRes.data.token);
    setUser(mockRes.data.user);
    setIsAuthenticated(true);
    setAuthToken(mockRes.data.token);
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(mockRes.data.user));
    
    return { success: true };
  } catch (err) {
    setError(err.response?.data?.message || 'Registration failed. Please try again.');
    return { success: false, error: err.response?.data?.message };
  }
};

// Update logout to clear stored user data
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user'); // Add this line
  setToken(null);
  setUser(null);
  setIsAuthenticated(false);
  delete api.defaults.headers.common['Authorization'];
};

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      setError(null);
      
      // In production, this would be a real API call
      // const res = await api.put('/api/users/profile', formData);
      
      // Mock successful profile update
      const updatedUser = {
        ...user,
        ...formData
      };
      
      setUser(updatedUser);
      
      return { success: true };
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
      return { success: false, error: err.response?.data?.message };
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