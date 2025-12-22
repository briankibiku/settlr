import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verify } from '../services/auth';
import { useAuth } from '../context/AuthContext';

const Verify = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); 
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();


   
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const messageParam = params.get('message'); 
    const contacts = extractPhoneAndEmail(messageParam);
    const { phone, email } = contacts || {};
    setPhone(phone);
    setEmail(email);

    if (messageParam) {
      setMessage(messageParam); 
    }
  }, []);
  

  const extractPhoneAndEmail = (sentence) => {
    const regex = /(\d{12}) and (\S+@\S+\.\S+)/;
    const matches = sentence.match(regex);
    if (matches) {
      return {
        phone: matches[1],
        email: matches[2]
      };
    }
    return null;
    };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Call login service
      const userData = await verify(email, otp);
      
      const { message } = userData;
      if (message == 'Registration successful') { 
        navigate(`/dashboard?message=${message}`);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {message} 
            </label>
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div> 
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Verifying in...' : 'Verify'}
          </button>
        </form> 
      </div>
    </div>
  );
};

export default Verify;