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

// Get transfer balance 
export const getTransfiBalance = async (currency = 'KES') => {
  try {
    const response = await api.get(`/transfi/balance?currency=${currency}`, { skipAuth: true }); 
    const {
      balance: [
        {
          totalCollectionsAmount,
          totalPayoutAmount,
          totalSettledAmount,
          totalUnsettledAmount,
          totalAvailablePrefundingBalance,
          totalPayoutFee,
          totalPayoutInTransitBalance
        }
      ],
      date // This gets the date string separately
    } = response.data;

    
    return { 
        totalCollectionsAmount,
        totalPayoutAmount,
        totalSettledAmount,
        totalUnsettledAmount,
        totalAvailablePrefundingBalance,
        totalPayoutFee,
        totalPayoutInTransitBalance,
        date // You might want to return the date too!
    };
  } catch (error) {
    // Standard error handling
    const errorMessage = error.response?.data?.message || 'Failed to get transfer balance';
    throw errorMessage;
  }
};
 