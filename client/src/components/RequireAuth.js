// RequireAuth.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api'; // Use the updated api.js that handles cookies

const RequireAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        await api.get('/auth/check'); // You might need to implement this route to check user status
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (!isAuthenticated) {
    return <Navigate to="/client" replace />;
  }

  return children; // If authenticated, render the child component (Dashboard)
};

export default RequireAuth;
