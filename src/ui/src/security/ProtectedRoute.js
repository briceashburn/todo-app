import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, setIsAuthenticated }) {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
    }
  }, [setIsAuthenticated]);

  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default ProtectedRoute;
