// ======================================================
// Protected Route Component
// ======================================================
// Wrapper component to protect routes requiring authentication
// ======================================================

import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Check if user is authenticated
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // Verify token is not expired (basic check)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    
    if (isExpired) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // Invalid token format
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    return <Navigate to="/login" replace />;
  }
  
  // User is authenticated, render children
  return children;
}

export default ProtectedRoute;
