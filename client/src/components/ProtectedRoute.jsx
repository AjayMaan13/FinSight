// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // For initial setup, let's just pass through
  return children;
};

export default ProtectedRoute;