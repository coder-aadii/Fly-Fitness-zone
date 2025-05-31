import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedNavbar from './components/FeedNavbar';
import CreatePost from './components/CreatePost';
import PostsList from './components/PostsList';
import Sidebar from './components/Sidebar';
import Loader from '../components/Loader';
import { ENDPOINTS } from '../config';
import { mockPosts } from './mockData';
import { checkAuth, handleApiError } from '../utils/errorHandler';

const FeedPage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
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
        
        // Fetch posts after user data is loaded
        fetchPosts(token);
      } catch (err) {
        handleApiError(err, navigate);
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchPosts = async (token) => {
      try {
        const response = await fetch(ENDPOINTS.FEED_POSTS, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // Handle specific error status codes
          if (response.status === 404) {
            // If the API endpoint doesn't exist yet, use mock data
            console.log('Posts API not found, using mock data');
            setPosts(mockPosts);
            setLoading(false);
            return;
          } else if (response.status === 503) {
            navigate('/maintenance');
            return;
          }
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data.posts || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        // Fallback to mock data if API fails
        setPosts(mockPosts);
        
        // Only show error page for non-404 errors
        if (err.message !== 'Failed to fetch posts') {
          handleApiError(err, navigate);
        }
        
        setError(err.message);
        setLoading(false);
      }
    };

    // Fetch real user data from backend
    fetchUserData();
  }, [navigate]);

  const handleCreatePost = (newPost) => {
    // Add the new post to the beginning of the posts array
    setPosts([newPost, ...posts]);
  };

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
      <FeedNavbar user={user} />
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - visible on large screens */}
          <div className="hidden lg:block lg:col-span-1">
            <Sidebar user={user} />
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            <CreatePost user={user} onPostCreated={handleCreatePost} />
            <div className="mt-6">
              <PostsList posts={posts} currentUser={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;