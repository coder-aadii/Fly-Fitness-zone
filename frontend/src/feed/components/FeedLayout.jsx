import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedNavbar from './FeedNavbar';
import Sidebar from './Sidebar';
import Loader from '../../components/Loader';
import { ENDPOINTS } from '../../config';
import { checkAuth, handleApiError } from '../../utils/errorHandler';

const FeedLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      // Check if user is authenticated
      if (!checkAuth(navigate, '/feed')) {
        return;
      }

      try {
        const token = localStorage.getItem('token');
        
        // Fetch user data from backend
        const response = await fetch(ENDPOINTS.USER_PROFILE, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // Handle specific error status codes
          if (response.status === 401) {
            navigate('/unauthorized');
            return;
          } else if (response.status === 503) {
            navigate('/maintenance');
            return;
          } else if (response.status === 500) {
            navigate('/server-error');
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        handleApiError(err, navigate);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={() => navigate('/login')} 
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Fixed Navbar */}
      <FeedNavbar user={user} />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl pt-8 mt-16 min-h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Fixed Sidebar - visible on large screens */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky" style={{ top: "5rem", maxHeight: "calc(100vh - 6rem)", overflowY: "auto" }}>
              <Sidebar user={user} />
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedLayout;