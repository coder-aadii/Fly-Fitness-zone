import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const userDataString = localStorage.getItem('userData');
      
      if (token) {
        setIsLoggedIn(true);
        if (userDataString) {
          try {
            setUserData(JSON.parse(userDataString));
          } catch (error) {
            console.error('Error parsing user data:', error);
            setUserData(null);
          }
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
      
      setLoading(false);
    };

    // Check auth status initially
    checkAuthStatus();

    // Listen for storage events (for cross-tab synchronization)
    window.addEventListener('storage', checkAuthStatus);
    
    // Listen for custom login/logout events
    const handleAuthEvent = () => {
      setTimeout(checkAuthStatus, 0);
    };
    
    window.addEventListener('loginStatusChanged', handleAuthEvent);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('loginStatusChanged', handleAuthEvent);
    };
  }, []);

  // Login function
  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(user));
    setIsLoggedIn(true);
    setUserData(user);
    window.dispatchEvent(new Event('loginStatusChanged'));
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserData(null);
    window.dispatchEvent(new Event('loginStatusChanged'));
  };

  // Update user data
  const updateUserData = (newData) => {
    const updatedUserData = { ...userData, ...newData };
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    setUserData(updatedUserData);
  };

  // Context value
  const value = {
    isLoggedIn,
    userData,
    loading,
    login,
    logout,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;