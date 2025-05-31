import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Offerings.css';

const offeringsData = [
  {
    id: 'zumba',
    title: 'Zumba',
    description: 'Zumba is a high-energy dance fitness program that combines Latin and international music with dance moves. It incorporates interval training—alternating fast and slow rhythms—to help improve cardiovascular fitness.',
    benefits: [
      'Burns calories and helps with weight management',
      'Improves cardiovascular health',
      'Boosts mood and reduces stress',
      'Improves coordination and flexibility'
    ],
    images: [
      'https://images.unsplash.com/photo-1517130038641-a774d04afb3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1532844232339-7f8d53250a76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/QRZcZgSgSHI',
    schedule: 'Mon, Wed, Fri: 7:00 - 8:00 AM, 8:15 - 9:15 AM and 6:15 - 7:15 PM',
    instructor: 'Ritesh Sontani / Jigyasa Bhatia'
  },
  {
    id: 'yoga',
    title: 'Yoga',
    description: 'Our yoga classes focus on physical postures (asanas), breathing techniques (pranayama), and meditation to promote physical strength, flexibility, mental clarity, and emotional balance.',
    benefits: [
      'Increases flexibility and muscle strength',
      'Improves respiration, energy, and vitality',
      'Helps maintain a balanced metabolism',
      'Reduces stress and promotes relaxation'
    ],
    images: [
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/v7AYKMP6rOE',
    schedule: 'Mon, Wed, Fri: 7:00 - 8:00 AM and 6:15 - 7:15 PM',
    instructor: 'Aditya Aerpule'
  },
  {
    id: 'therapeutic-yoga',
    title: 'Therapeutic Yoga',
    description: 'Therapeutic yoga is a gentle, restorative practice designed to heal and balance the body. It combines gentle yoga postures, breathwork, meditation, and relaxation techniques to address specific health concerns.',
    benefits: [
      'Alleviates chronic pain and tension',
      'Supports recovery from injury or illness',
      'Reduces anxiety and depression',
      'Improves sleep quality and overall well-being'
    ],
    images: [
      'https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1573590330099-d6c7355ec595?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/4pKly2JojMw',
    schedule: 'Mon, Wed, Fri: 6:00 - 7:00 AM',
    instructor: 'Aditya Aerpule'
  },
  {
    id: 'tabata',
    title: 'Tabata',
    description: 'Tabata is a high-intensity interval training (HIIT) workout featuring exercises that last four minutes. The format is 20 seconds of intense exercise followed by 10 seconds of rest, repeated 8 times.',
    benefits: [
      'Burns fat and increases metabolism',
      'Improves athletic performance',
      'Efficient workout in minimal time',
      'Continues to burn calories after workout'
    ],
    images: [
      'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80',
      'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/XIeCMhNWFQQ',
    schedule: 'Tue: 7:00 - 8:00 AM, 8:15 - 9:15 AM and 6:15 - 7:15 PM',
    instructor: 'Aditya Aerpule / Ritesh Sontani / Jigyasa Bhatia'
  },
  {
    id: 'weight-training',
    title: 'Weight Training',
    description: 'Our weight training program focuses on building strength, muscle mass, and endurance using free weights, weight machines, and bodyweight exercises. Suitable for beginners to advanced fitness enthusiasts.',
    benefits: [
      'Builds muscle mass and strength',
      'Increases bone density',
      'Improves body composition',
      'Enhances athletic performance'
    ],
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/U0bhE67HuDY',
    schedule: 'Thu: 7:00 - 8:00 AM, 8:15 - 9:15 AM and 6:15 - 7:15 PM (Alternative)',
    instructor: 'Aditya Aerpule / Ritesh Sontani / Jigyasa Bhatia'
  },
  {
    id: 'bodyweight-training',
    title: 'Bodyweight Training',
    description: 'Bodyweight training uses your own body weight as resistance to build strength, flexibility, and endurance without the need for equipment. Perfect for all fitness levels and can be modified to increase difficulty.',
    benefits: [
      'No equipment needed - train anywhere',
      'Improves functional strength and mobility',
      'Develops core stability and balance',
      'Reduces risk of injury'
    ],
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1597347316205-36f6c451902a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/oAPCPjnU1wA',
    schedule: 'Thu: 7:00 - 8:00 AM, 8:15 - 9:15 AM and 6:15 - 7:15 PM (Alternative)',
    instructor: 'Aditya Aerpule / Ritesh Sontani / Jigyasa Bhatia'
  },
  {
    id: 'circuit-training',
    title: 'Circuit Training',
    description: 'Circuit training involves a series of exercises performed in rotation with minimal rest, targeting different muscle groups. This approach provides a full-body workout that combines strength training and cardio.',
    benefits: [
      'Efficient full-body workout',
      'Improves cardiovascular health',
      'Burns calories and builds muscle simultaneously',
      'Adds variety to your fitness routine'
    ],
    images: [
      'https://images.unsplash.com/photo-1518644730709-0835105d9daa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/7dT4KHtMM-A',
    schedule: 'Sat: 6:00 - 8:00 AM',
    instructor: 'Aditya Aerpule / Ritesh Sontani / Jigyasa Bhatia'
  },
  {
    id: 'outdoor-sessions',
    title: 'Outdoor Sessions',
    description: 'Take your workout into nature with our outdoor fitness sessions. These classes combine cardio, strength, and flexibility exercises in the fresh air, utilizing natural terrain and park features.',
    benefits: [
      'Fresh air and vitamin D exposure',
      'Natural terrain provides varied challenges',
      'Mental health benefits of being in nature',
      'Community building in open spaces'
    ],
    images: [
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1594882645126-14020914d58d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1185&q=80',
      'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/CBWQGb4LyAM',
    schedule: 'Sat: 6:00 - 8:00 AM (Weather Permitting)',
    instructor: 'Aditya Aerpule / Ritesh Sontani / Jigyasa Bhatia'
  }
];

const Offerings = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(offeringsData[0].id);
  const [activeOffering, setActiveOffering] = useState(offeringsData[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [autoRotationPaused, setAutoRotationPaused] = useState(false);

  useEffect(() => {
    // Find the offering data that matches the active tab
    const offering = offeringsData.find(item => item.id === activeTab);
    setActiveOffering(offering);
    setCurrentImageIndex(0);
  }, [activeTab]);

  useEffect(() => {
    // Set isLoaded to true after a short delay to trigger animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate tabs
  useEffect(() => {
    // If user has interacted and auto-rotation is paused, don't auto-rotate
    if (autoRotationPaused) return;

    const tabInterval = setInterval(() => {
      // Find current tab index
      const currentIndex = offeringsData.findIndex(item => item.id === activeTab);
      // Calculate next tab index
      const nextIndex = (currentIndex + 1) % offeringsData.length;
      // Set next tab
      setActiveTab(offeringsData[nextIndex].id);
    }, 5000); // Switch tabs every 5 seconds

    return () => clearInterval(tabInterval);
  }, [activeTab, autoRotationPaused]);

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeOffering.images.length > 1) {
        setCurrentImageIndex(prevIndex => 
          prevIndex === activeOffering.images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeOffering]);

  // Resume auto-rotation after 1 minute of user interaction
  useEffect(() => {
    if (userInteracted) {
      setAutoRotationPaused(true);
      
      const timer = setTimeout(() => {
        setAutoRotationPaused(false);
        setUserInteracted(false);
      }, 60000); // 1 minute
      
      return () => clearTimeout(timer);
    }
  }, [userInteracted]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setUserInteracted(true);
  };

  const nextImage = () => {
    setCurrentImageIndex(prevIndex => 
      prevIndex === activeOffering.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prevIndex => 
      prevIndex === 0 ? activeOffering.images.length - 1 : prevIndex - 1
    );
  };

  const handleBookSessionClick = (e) => {
    e.preventDefault();
    // If not already on the homepage, navigate to home and then scroll
    if (location.pathname !== "/") {
      window.location.href = "/#contact"; // This reloads home and jumps to contact
    } else {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div id="offerings" className="bg-gradient-to-r from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Our Fitness Offerings</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our wide range of fitness programs designed to help you achieve your health and wellness goals.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="relative">
            {autoRotationPaused && (
              <div className="absolute -top-8 right-0 text-xs text-gray-500">
                Auto-rotation paused for 1 minute
              </div>
            )}
            <div className="flex space-x-1 min-w-max p-1 bg-gray-100 rounded-xl">
            {offeringsData.map((offering, index) => (
              <button
                key={offering.id}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap hover:scale-105 active:scale-95
                  ${activeTab === offering.id 
                    ? 'bg-white text-orange-600 shadow-md' 
                    : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'}`}
                onClick={() => handleTabClick(offering.id)}
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.3s ease ${0.1 + index * 0.05}s`
                }}
              >
                {offering.title}
              </button>
            ))}
            </div>
            {!autoRotationPaused && (
              <div className="mt-2 flex justify-center">
                <div className="flex space-x-1">
                  {offeringsData.map((offering) => (
                    <div 
                      key={`indicator-${offering.id}`}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        activeTab === offering.id 
                          ? 'w-8 bg-orange-500' 
                          : 'w-2 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div
          key={activeTab}
          className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 relative"
          style={{ opacity: 1, transform: 'translateY(0)' }}
        >
          {!autoRotationPaused && (
            <div className="auto-rotation-progress"></div>
          )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Carousel */}
              <div className="relative h-80 sm:h-96 lg:h-full overflow-hidden">
                <div
                  key={currentImageIndex}
                  className="absolute inset-0 bg-gray-200 transition-opacity duration-500"
                  style={{ opacity: 1 }}
                >
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <img 
                        src={activeOffering.images[currentImageIndex]} 
                        alt={`${activeOffering.title} ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
                        }}
                      />
                    </div>
                  </div>

                {/* Image Navigation */}
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <button 
                    onClick={prevImage}
                    className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200 transform hover:scale-110"
                    aria-label="Previous image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={nextImage}
                    className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200 transform hover:scale-110"
                    aria-label="Next image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {activeOffering.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                        currentImageIndex === index ? 'bg-white scale-125' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 flex flex-col h-full">
                <h3 
                  className="text-3xl font-bold text-gray-900 mb-4 transition-all duration-300"
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: '0.1s'
                  }}
                >
                  {activeOffering.title}
                </h3>
                
                <p 
                  className="text-gray-600 mb-6 transition-all duration-300"
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: '0.2s'
                  }}
                >
                  {activeOffering.description}
                </p>
                
                <div
                  className="transition-all duration-300"
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: '0.3s'
                  }}
                >
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">Benefits</h4>
                  <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-1">
                    {activeOffering.benefits.map((benefit, index) => (
                      <li 
                        key={index}
                        className="transition-all duration-300"
                        style={{
                          opacity: isLoaded ? 1 : 0,
                          transform: isLoaded ? 'translateX(0)' : 'translateX(-20px)',
                          transitionDelay: `${0.4 + index * 0.1}s`
                        }}
                      >
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div 
                  className="mt-auto space-y-3 transition-all duration-300"
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: '0.6s'
                  }}
                >
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">Schedule: <span className="font-normal text-gray-700">{activeOffering.schedule}</span></p>
                    <p className="font-medium text-gray-900">Instructor: <span className="font-normal text-gray-700">{activeOffering.instructor}</span></p>
                  </div>
                  
                  <a 
                    href="#contact" 
                    onClick={handleBookSessionClick}
                    className="inline-block w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors duration-200"
                  >
                    Book a Session
                  </a>
                  
                </div>
              </div>
            </div>

            {/* Video Section */}
            <div className="p-6 sm:p-8 border-t border-gray-100">
              <h4 
                className="text-xl font-semibold text-gray-900 mb-4 transition-all duration-300"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: '0.7s'
                }}
              >
                Watch {activeOffering.title} in Action
              </h4>
              
              <div 
                className="video-container rounded-lg overflow-hidden transition-all duration-300"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: '0.8s'
                }}
              >
                <iframe 
                  src={activeOffering.videoUrl} 
                  title={`${activeOffering.title} video`} 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Offerings;