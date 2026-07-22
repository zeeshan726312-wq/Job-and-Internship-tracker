import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useContext(AppContext);

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to their default dashboard if they try to access an unauthorized panel
    const defaultRoutes = {
      user: '/',
      employer: '/employer',
      mentor: '/mentor',
      admin: '/admin'
    };
    return <Navigate to={defaultRoutes[currentUser.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
