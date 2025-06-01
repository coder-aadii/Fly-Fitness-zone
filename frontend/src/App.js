import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import GlobalLoader from './components/GlobalLoader';
import { AuthProvider } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyOTP from './pages/VerifyOTP';
import Album from './pages/Album';
import UserDashboard from './pages/UserDashboard';
import UserSettings from './pages/UserSettings';
import AdminDashboard from './pages/AdminDashboard';
import FeedPage from './feed/FeedPage';
import NotFound from './pages/NotFound';
// import LoaderTest from './pages/LoaderTest';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <GlobalLoader />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* User Routes */}
        <Route path="/album" element={<Album />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/UserSettings" element={<UserSettings />} />
        <Route path="/feed" element={<FeedPage />} />
        {/* <Route path="/loader-test" element={<LoaderTest />} /> */}
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Error Routes */}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/unauthorized" element={<NotFound type="unauthorized" />} />
        <Route path="/server-error" element={<NotFound type="server" />} />
        <Route path="/maintenance" element={<NotFound type="maintenance" />} />
        <Route path="/session-expired" element={<NotFound type="expired" />} />
        
        {/* Catch-all route for 404 errors */}
        <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;