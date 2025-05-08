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
  const loadUser = async () => {
    if (token) {
      setAuthToken(token);
      
      try {
        // Temporarily mock user data for development
        // In production, this would be a real API call
        // const res = await api.get('/api/auth/me');
        // setUser(res.data.user);
        
        // Mock user data for development
        setUser({
          id: '123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        });
        
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

  // Register user
  const register = async (formData) => {
    try {
      setError(null);
      
      // In production, this would be a real API call
      // const res = await api.post('/api/auth/register', formData);
      
      // Mock successful registration
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
      
      return { success: true };
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Registration failed. Please try again.'
      );
      return { success: false, error: err.response?.data?.message };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      setError(null);
      
      // In production, this would be a real API call
      // const res = await api.post('/api/auth/login', formData);
      
      // Mock successful login
      const mockRes = {
        data: {
          token: 'mock-token-123',
          user: {
            id: '123',
            firstName: 'John',
            lastName: 'Doe',
            email: formData.email
          }
        }
      };
      
      setToken(mockRes.data.token);
      setUser(mockRes.data.user);
      setIsAuthenticated(true);
      setAuthToken(mockRes.data.token);
      
      return { success: true };
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
      return { success: false, error: err.response?.data?.message };
    }
  };


  // In your AuthContext.jsx
const logout = () => {
  localStorage.removeItem('token');
  setToken(null);
  setUser(null);
  setIsAuthenticated(false);
  // Also clear any Authorization headers in your API service
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