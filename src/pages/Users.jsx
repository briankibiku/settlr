
import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
   
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // This endpoint should be protected on your backend
        // const response = await api.get('/dashboard/stats');
      setDashboardData({
        totalBalance: 1500000,
        ledgerBalance: 1500000,
        accountBalance: 3000000,
      });
    //   setDashboardData(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
            {/* <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
              Wallet
            </h1> */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
                Users
              </h1>
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create User
              </button>
            </div>
             

            
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-50">Name</th>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-50">Email</th>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 border-b border-gray-200">{`User ${i+1}`}</td>
                    <td className="px-6 py-4 border-b border-gray-200">{`user${i+1}@example.com`}</td>
                    <td className="px-6 py-4 border-b border-gray-200 flex items-center space-x-4">
                      <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => alert(`Edit user ${i+1}`)}>Edit</button>
                      <button className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500" onClick={() => alert(`Delete user ${i+1}`)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>  
          </div>
        </main>
      </div>
    </div>
  );
};

export default Users;