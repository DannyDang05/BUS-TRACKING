import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Only allow access if user is admin
const AdminRoute = () => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('bus_user'));
  } catch {}
  const isAdmin = user && (user.role === 'admin' || user.Role === 'admin');
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
