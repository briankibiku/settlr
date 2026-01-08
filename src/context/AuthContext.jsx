// import { createContext, useState, useContext, useEffect } from 'react';
// import { getCurrentUser, logout as logoutService } from '../services/auth';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   // Check if user is logged in on mount
//   useEffect(() => {
//     const loadUser = () => {
//       try {
//         const currentUser = getCurrentUser();
//         setUser(currentUser);
//       } catch (error) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     loadUser();
//   }, []);
  
//   const login = (userData) => {
//     setUser(userData);
//   };
  
//   const logout = () => {
//     logoutService();
//     // setUser(null);
//   };
  
//   const value = {
//     user,
//     login,
//     logout,
//     isAuthenticated: !!user,
//     loading
//   };
  
//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

import { createContext, useState, useContext, useEffect } from "react";
import { logout as logoutService } from "../services/auth";
import { getAccessToken } from "../utils/tokenUtils";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = getAccessToken();
        setIsAuthenticated(!!token); // Set to true if token exists, false otherwise
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    logoutService(); // This clears tokens from localStorage
    setIsAuthenticated(false);
    window.location.href = "/"; // Force redirect to login
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};