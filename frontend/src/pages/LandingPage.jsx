import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutUs from '../components/AboutUs';
import Offerings from '../components/Offerings';
import ClassesOverview from '../components/ClassesOverview';
import TrainerProfiles from '../components/TrainerProfiles';
import Testimonials from '../components/Testimonials';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <Offerings />
      <AboutUs />
      <ClassesOverview />
      <TrainerProfiles />
      <Testimonials />
      <ContactForm />
      <Footer />
    </>
  );
};

export default LandingPage;