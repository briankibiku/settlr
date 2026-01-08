import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  const getAccessToken = () => localStorage.getItem("accessToken"); 
  
  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!getAccessToken() || getAccessToken() === '') {
    return <Navigate to="/" replace />;
  }
  
  // Render the protected component
  return children;
};

export default ProtectedRoute;