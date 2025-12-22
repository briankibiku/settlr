

import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import api from '../services/api';
import { regenerate } from '../services/partners';

const ApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState([]);
  const [clientId, setClientId] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [newKeyName, setNewKeyName] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const apiKeyParam = params.get('apiKey'); 
    const clientIdParam = params.get('clientId');
    const partnerIdParam = params.get('partnerId');
    setClientId(clientIdParam);
    setPartnerId(partnerIdParam);
    setApiKey(apiKeyParam); 
    // fetchApiKeys();
  }, []);
  
  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api-keys');
      setApiKeys(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };
  
  const generateApiKey = async () => {
    if (!newKeyName.trim()) {
      setError('Please enter a partner id');
      return;
    }
    
    try {
      const response = await regenerate(partnerId);
      
      const { apiKey } = response;
      
      setApiKey(apiKey);
      alert(`API Key generated successfully!\n\nKey: ${response.data.key}\n\nMake sure to copy this key now. You won't be able to see it again!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate API key');
    } finally {
      setGenerating(false);
    }
  };
  
  const revokeApiKey = async (keyId) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/api-keys/${keyId}`);
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
    } catch (err) {
      setError('Failed to revoke API key');
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">API Keys 🔑</h1>
            
            {/* Generate New Key Section */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Generate New API Key</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Enter partner id to generate api key"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={generateApiKey}
                  disabled={generating}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors shadow-sm whitespace-nowrap"
                >
                  {generating ? 'Generating...' : 'Generate Key'}
                </button>
              </div>
              
              <div className="mt-3 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p>Make sure to copy your API key immediately after generation. You won't be able to see it again.</p>
              </div>
            </div>
            
            {/* Existing Keys Section */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Your API Keys</h2>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-6">

                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-bold mb-1">API Key:</p>
                    <p className="text-sm">{apiKey}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold mb-1">Client ID:</p>
                    <p className="text-sm">{clientId}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold mb-1">Partner ID:</p>
                    <p className="text-sm">{partnerId}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    const textArea = document.createElement('textarea');
                    textArea.value = `API Key: ${new URLSearchParams(window.location.search).get('apiKey')}\nClient ID: ${new URLSearchParams(window.location.search).get('clientId')}\nPartner ID: ${new URLSearchParams(window.location.search).get('partnerId')}`;
                    document.body.appendChild(textArea);
                    textArea.select();
                    navigator.clipboard.writeText(textArea.value).then(function() {
                      console.log('Text copied to clipboard');
                    }).catch(function(err) {
                      console.error('Error copying text: ', err);
                    });
                    textArea.remove();
                  }}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-sm whitespace-nowrap"
                >
                  Copy
                </button>
                </div> 
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApiKeys;