import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect them to the /login page
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute; 