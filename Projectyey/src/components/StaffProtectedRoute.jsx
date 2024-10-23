// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const StaffProtectedRoute = () => {
  const { staff } = useAuth();

  // If no staff in context or localStorage, redirect to login
  const storedStaff = localStorage.getItem('staff');
  if (!staff && !storedStaff) {
    return <Navigate to="/login-staff" replace />;
  }

  // If valid session, render the child components
  return <Outlet />;
};

export default StaffProtectedRoute;
