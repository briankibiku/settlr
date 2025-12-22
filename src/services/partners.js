import api from './api';

// Login user
export const regenerate = async (partnerId) => {
  try {
    const response = await api.put('/patner/apikey/regenerate', { partnerId }); 
    const { apiKey } = response.data; 
    
    // Return user data
    return { apiKey };
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};
