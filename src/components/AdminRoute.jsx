import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage={true} />;
  }

  if (!user || !user.isAdmin) {
    // If not authenticated or not admin, redirect to Home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
