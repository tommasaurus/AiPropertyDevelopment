import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../services/token'; // Use the token helper you already created

const RequireAuth = ({ children }) => {
  const token = getAccessToken();

  if (!token) {
    // If there is no token, redirect to the login page
    return <Navigate to="/client" replace />;
  }

  return children; // If authenticated, render the child component (Dashboard)
};

export default RequireAuth;
