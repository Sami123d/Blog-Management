import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function withAuth(WrappedComponent, requiredRole) {
  return (props) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (requiredRole && !requiredRole.includes(user.role)) return <Navigate to="/unauthorized" />;
    return <WrappedComponent {...props} />;
  };
}
