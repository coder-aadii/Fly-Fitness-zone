import React, { useState, useEffect } from 'react';
import { 
    FaDumbbell, 
    FaUsers, 
    FaComments, 
    FaCalendarAlt, 
    FaSync, 
    FaExclamationCircle,
    FaCheckCircle
} from 'react-icons/fa';
import { ENDPOINTS, getImageUrl } from '../../config';

const LandingPageContent = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [landingPageData, setLandingPageData] = useState({
        classes: [],
        trainers: [],
        testimonials: []
    });
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchLandingPageContent();
    }, []);

    const fetchLandingPageContent = async () => {
        try {
            setLoading(true);
            setError(null);
            setRefreshing(true);
            
            const token = localStorage.getItem('token');
            
            // Fetch classes, trainers, and testimonials in parallel
            const [classesResponse, trainersResponse, testimonialsResponse] = await Promise.all([
                fetch(ENDPOINTS.ADMIN_CLASSES, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                fetch(ENDPOINTS.ADMIN_TRAINERS, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                fetch(`${ENDPOINTS.ADMIN_TESTIMONIALS}?status=approved`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            ]);
            
            // Handle classes response
            let classes = [];
            if (classesResponse.ok) {
                const classesData = await classesResponse.json();
                classes = Array.isArray(classesData) ? classesData.filter(cls => cls.active !== false) : [];
            } else {
                console.warn('Failed to fetch classes');
            }
            
            // Handle trainers response
            let trainers = [];
            if (trainersResponse.ok) {
                const trainersData = await trainersResponse.json();
                trainers = Array.isArray(trainersData) ? trainersData.filter(trainer => trainer.active !== false) : [];
            } else {
                console.warn('Failed to fetch trainers');
            }
            
            // Handle testimonials response
            let testimonials = [];
            if (testimonialsResponse.ok) {
                const testimonialsData = await testimonialsResponse.json();
                testimonials = Array.isArray(testimonialsData) 
                    ? testimonialsData.filter(testimonial => testimonial.status === 'approved')
                    : [];
                
                // Sort by featured first, then by date
                testimonials.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
            } else {
                console.warn('Failed to fetch testimonials');
            }
            
            setLandingPageData({
                classes,
                trainers,
                testimonials
            });
            
            setSuccess('Landing page content refreshed successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error fetching landing page content:', err);
            setError('Failed to load landing page content. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Format time for display
    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHour = hours % 12 || 12;
        return `${formattedHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    // Group classes by time of day (morning/evening)
    const groupClassesByTimeOfDay = () => {
        const morningClasses = [];
        const eveningClasses = [];
        
        landingPageData.classes.forEach(cls => {
            const startHour = new Date(cls.startTime).getHours();
            
            if (startHour < 12) {
                morningClasses.push(cls);
            } else {
                eveningClasses.push(cls);
            }
        });
        
        return { morningClasses, eveningClasses };
    };

    const { morningClasses, eveningClasses } = groupClassesByTimeOfDay();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Landing Page Content</h2>
                <button
                    onClick={fetchLandingPageContent}
                    disabled={refreshing}
                    className={`flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg ${
                        refreshing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <FaSync className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing...' : 'Refresh Content'}
                </button>
            </div>
            
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 flex items-center">
                    <FaExclamationCircle className="mr-2" />
                    <p>{error}</p>
                </div>
            )}
            
            {success && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 flex items-center">
                    <FaCheckCircle className="mr-2" />
                    <p>{success}</p>
                </div>
            )}
            
            {loading && !refreshing ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Classes Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <FaCalendarAlt className="text-orange-500 mr-2 text-xl" />
                            <h3 className="text-xl font-semibold text-gray-800">Classes on Landing Page</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Morning Classes */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-orange-600 mb-3">Morning Batches</h4>
                                {morningClasses.length > 0 ? (
                                    <ul className="space-y-2">
                                        {morningClasses.map(cls => (
                                            <li key={cls._id} className="flex items-center text-gray-700">
                                                <span className="w-32 font-medium">
                                                    {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                                                </span>
                                                <span className="ml-2">{cls.className}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 italic">No morning classes scheduled</p>
                                )}
                            </div>
                            
                            {/* Evening Classes */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-orange-600 mb-3">Evening Batches</h4>
                                {eveningClasses.length > 0 ? (
                                    <ul className="space-y-2">
                                        {eveningClasses.map(cls => (
                                            <li key={cls._id} className="flex items-center text-gray-700">
                                                <span className="w-32 font-medium">
                                                    {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                                                </span>
                                                <span className="ml-2">{cls.className}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 italic">No evening classes scheduled</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => window.location.hash = '#classes'}
                                className="text-orange-500 hover:text-orange-600 font-medium"
                            >
                                Manage Classes →
                            </button>
                        </div>
                    </div>
                    
                    {/* Trainers Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <FaDumbbell className="text-orange-500 mr-2 text-xl" />
                            <h3 className="text-xl font-semibold text-gray-800">Trainers on Landing Page</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {landingPageData.trainers.length > 0 ? (
                                landingPageData.trainers.map(trainer => (
                                    <div key={trainer._id} className="border border-gray-200 rounded-lg p-4 flex items-center">
                                        <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                                            {trainer.profileImage ? (
                                                <img 
                                                    src={getImageUrl(trainer.profileImage)} 
                                                    alt={trainer.name} 
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-orange-200 flex items-center justify-center">
                                                    <span className="text-orange-500 font-semibold">
                                                        {trainer.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{trainer.name}</h4>
                                            <p className="text-sm text-orange-500">{trainer.specialty}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-6">
                                    <p className="text-gray-500 italic">No trainers available</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => window.location.hash = '#trainers'}
                                className="text-orange-500 hover:text-orange-600 font-medium"
                            >
                                Manage Trainers →
                            </button>
                        </div>
                    </div>
                    
                    {/* Testimonials Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <FaComments className="text-orange-500 mr-2 text-xl" />
                            <h3 className="text-xl font-semibold text-gray-800">Testimonials on Landing Page</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {landingPageData.testimonials.length > 0 ? (
                                landingPageData.testimonials.slice(0, 6).map(testimonial => (
                                    <div 
                                        key={testimonial._id} 
                                        className={`border ${testimonial.featured ? 'border-orange-300 bg-orange-50' : 'border-gray-200'} rounded-lg p-4`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-800">{testimonial.user?.name}</h4>
                                            {testimonial.featured && (
                                                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-3">{testimonial.text}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-6">
                                    <p className="text-gray-500 italic">No approved testimonials available</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => window.location.hash = '#testimonials'}
                                className="text-orange-500 hover:text-orange-600 font-medium"
                            >
                                Manage Testimonials →
                            </button>
                        </div>
                    </div>
                    
                    {/* User Stats */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <FaUsers className="text-orange-500 mr-2 text-xl" />
                            <h3 className="text-xl font-semibold text-gray-800">Landing Page Overview</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="border border-gray-200 rounded-lg p-4 text-center">
                                <p className="text-3xl font-bold text-orange-500">{landingPageData.classes.length}</p>
                                <p className="text-gray-600">Active Classes</p>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4 text-center">
                                <p className="text-3xl font-bold text-orange-500">{landingPageData.trainers.length}</p>
                                <p className="text-gray-600">Active Trainers</p>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4 text-center">
                                <p className="text-3xl font-bold text-orange-500">{landingPageData.testimonials.length}</p>
                                <p className="text-gray-600">Approved Testimonials</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPageContent;