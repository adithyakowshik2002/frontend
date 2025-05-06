import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Named import

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (role && decoded.role !== role) {
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  } catch (err) {
    console.error('Token decoding error:', err);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;