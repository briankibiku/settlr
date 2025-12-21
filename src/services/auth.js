import api from './api';
import { setTokens, clearTokens, getAccessToken, getUserFromToken } from '../utils/tokenUtils';

// Login user
export const login = async (emailAddress, password) => {
  try {
    const response = await api.put('/auth/login', { emailAddress, password });
    // const { accessToken, refreshToken } = response.data;
    const { phoneNumber, message } = response.data;
    
    // Store tokens
    // setTokens(accessToken, refreshToken);
    
    // Return user data
    return getUserFromToken(message);
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};


// Verify code 
export const verify = async (phoneOrEmail, otp) => {
  try {
    const response = await api.post('/auth/validate', { phoneOrEmail, otp });
    const { accessToken, refreshToken } = response.data;
    
    // Store tokens
    // setTokens(accessToken, refreshToken);
    
    // Return user data
    return getUserFromToken('validated');
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

// Register new user
export const signup = async (
  fullName,
  idNumber,
  businessIdNumber,
  gender,
  dateOfBirth,
  phoneNumber,
  email,
  password,
  confirmPassword,
  verified,
  status
) => {
  try {
    const response = await api.post('/auth/register', { 
  fullName,
  idNumber,
  businessIdNumber,
  gender,
  dateOfBirth,
  phoneNumber,
  email,
  password,
  confirmPassword, verified, status,});
    // const { accessToken, refreshToken } = response.data;
    
    // Store tokens
    // setTokens(accessToken, refreshToken);
    
    // Return user data
    return getUserFromToken('accessToken');
  } catch (error) {
    throw error.response?.data?.message || 'Signup failed';
  }
};

// Logout user
export const logout = () => {
  clearTokens();
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAccessToken();
  return !!token; // Returns true if token exists
};

// Get current user from token
export const getCurrentUser = () => {
  const token = getAccessToken();
  return getUserFromToken(token);
};