import axios from'axios';
 import api from './axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const register = async newUser => {
  // Check if any required field is empty
  if (!newUser.first_name || !newUser.last_name || !newUser.email || !newUser.password) {
    toast.warn('Please fill in all required fields');
    return;
  }

  try {
    const res = await axios.post('http://localhost:8070/register', {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      password: newUser.password
    });

    console.log('Registered');
    toast.success('Registered');
    return res.data;
  } catch (err) {
    console.log('Registration failed:', err);
    if (err.response && err.response.data) {
      // Display error message from the server response
      toast.warn(err.response.data.error);
    } else {
      // Display a generic error message
      toast.error('Registration failed. Please try again later.');
    }
    throw err; // re-throw the error for the caller to handle it
  }
};

  

  export const login = async user => {
      // Check if email and password are empty
  if (!user.email || !user.password) {
    toast.warn('Please enter both email and password');
    return;
  }
    try {
      const res = await axios.post('http://localhost:8070/login', {
        email: user.email,
        password: user.password
      });
  
      localStorage.setItem('usertoken', res.data);
      localStorage.setItem('token', res.data.token);
      return res.data;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data) {
        // Display error message from the server response
        toast.error(err.response.data.error);
      } else {
        // Display a generic error message
        toast.error('Login failed. Please try again later.');
      }
      throw err;
    }
  };


// Admin Login Function
export const AdminLogin = async (user) => {
  try {
    const res = await api.post('http://localhost:8070/admin/login', {
      email: user.email,
      password: user.password,
    });

    if (res.data.token) {
      // Store token in localStorage
      localStorage.setItem('token', res.data.token);
      console.log('Token received:', res.data.token); // Log the token


      return res.data; // Successfully logged in
    } else {
      console.error('No token in response');
      return false;  // Token not received
    }
  } catch (error) {
    console.error('Admin login error', error);
    return false;
  }
};
