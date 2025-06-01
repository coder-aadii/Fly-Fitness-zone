import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedLayout from './components/FeedLayout';
import CreatePost from './components/CreatePost';
import PostsList from './components/PostsList';
import Loader from '../components/Loader';
import { ENDPOINTS } from '../config';
import { mockPosts } from './mockData';
import { checkAuth, handleApiError } from '../utils/errorHandler';

// Utility function to filter out expired posts
const filterExpiredPosts = (posts) => {
  const now = new Date();
  return posts.filter(post => {
    // Check if post has expiresAt field
    if (!post.expiresAt) {
      // If no expiresAt field, calculate it based on createdAt (24 hours later)
      const createdAt = new Date(post.createdAt);
      const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
      return now < expiresAt;
    }
    
    // If post has expiresAt field, check if it's expired
    return now < new Date(post.expiresAt);
  });
};

const FeedPage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Periodically check for expired posts (every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      // Filter out any posts that have expired while user is viewing the feed
      setPosts(prevPosts => filterExpiredPosts(prevPosts));
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

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
            
            // Filter out expired mock posts
            const filteredMockPosts = filterExpiredPosts(mockPosts);
            setPosts(filteredMockPosts);
            setLoading(false);
            return;
          } else if (response.status === 503) {
            navigate('/maintenance');
            return;
          }
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        
        // Filter out expired posts
        const filteredPosts = filterExpiredPosts(data.posts || []);
        setPosts(filteredPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        // Fallback to mock data if API fails
        
        // Filter out expired mock posts
        const filteredMockPosts = filterExpiredPosts(mockPosts);
        setPosts(filteredMockPosts);
        
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
    // Make sure the new post has an expiresAt field
    if (!newPost.expiresAt) {
      // If no expiresAt field, calculate it based on createdAt (24 hours later)
      const createdAt = new Date(newPost.createdAt);
      newPost.expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
    }
    
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
    <FeedLayout>
      <CreatePost user={user} onPostCreated={handleCreatePost} />
      <div className="mt-6">
        <PostsList posts={posts} currentUser={user} />
      </div>
    </FeedLayout>
  );
};

export default FeedPage;