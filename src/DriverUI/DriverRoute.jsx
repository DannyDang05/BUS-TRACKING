import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Only allow access if user is driver
const DriverRoute = () => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('bus_user'));
  } catch {}
  const isDriver = user && (user.role === 'driver' || user.Role === 'driver');
  if (!isDriver) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default DriverRoute;
