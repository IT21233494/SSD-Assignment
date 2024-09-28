import React from 'react';
import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children, roleRequired }) => {
  
  const token = localStorage.getItem('token');

  // If there is no token, redirect to login
  if (!token) { 
    toast.error('Please login to access this page.', {
      position: toast.POSITION.TOP_RIGHT
    });
    return <Navigate to="/login" />;
  }

  try {
    // Decode the token to check user role or expiration
    const decoded = jwt_decode(token);

    // Check if the token has expired
    const currentTime = Date.now() / 1000; // in seconds
    if (decoded.exp < currentTime) {
      // If expired, clear token and redirect to login
      localStorage.removeItem('token');
      return <Navigate to="/login" />;
    }

    // If the roleRequired is "admin", check if the user has the admin role
    if (roleRequired === 'admin' && decoded.role !== 'admin') {
      return <Navigate to="/" />;
    }

    // If everything checks out, allow access to the component
    return children;

  } catch (err) {
    console.error('Error decoding token:', err);
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
