import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  console.log('token', token);

  if (token) {
    return <Outlet />;
  }
  return <Navigate to='/login' replace />;
};

export default ProtectedRoute;
