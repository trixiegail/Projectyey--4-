// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { doctor } = useAuth();

  // If no doctor in context or localStorage, redirect to login
  const storedDoctor = localStorage.getItem('doctor');
  if (!doctor && !storedDoctor) {
    return <Navigate to="/login-doctor" replace />;
  }

  // If valid session, render the child components
  return <Outlet />;
};

export default ProtectedRoute;
