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

// import { useEffect } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { loading } = useAuth();

//   const navigate = useNavigate();

//   const getAccessToken = () => localStorage.getItem("accessToken");

//   const isAuthenticated = getAccessToken() !== null && getAccessToken() !== "";
  

//   // Imperative redirect on auth loss (handles logout cleanly)
//   useEffect(() => {
//     if ((!loading && !isAuthenticated)) {
//       navigate("/", { replace: true });
//     }
//   }, [isAuthenticated, loading, navigate]);

//   // Show loading state while auth is resolving
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-xl">Loading...</div>
//       </div>
//     );
//   }

//   // Declarative fallback (extra safety)
//   if (isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   // Authenticated → render protected content
//   return children;
// };

// export default ProtectedRoute;
