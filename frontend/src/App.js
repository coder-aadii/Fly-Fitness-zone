import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutUs from './components/AboutUs';
import ClassesOverview from './components/ClassesOverview';
import TrainerProfiles from './components/TrainerProfiles';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

import Login from './pages/Login';
import Register from './pages/Register';
import Album from './pages/Album';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={
          <>
            <HeroSection />
            <AboutUs />
            <ClassesOverview />
            <TrainerProfiles />
            <Testimonials />
            <ContactForm />
            <Footer />
          </>
        } />

        {/* Album Route */}
        <Route path="/album" element={<Album />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Routes */}
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;