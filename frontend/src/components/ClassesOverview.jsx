import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import { ENDPOINTS } from '../config';

// Default batch times if API fails
const defaultBatchTimes = {
    morning: ['6:00 AM – 7:00 AM', '7:00 AM – 8:00 AM', '8:00 AM – 9:00 AM'],
    evening: ['5:00 PM – 6:00 PM', '6:00 PM – 7:00 PM']
};

const ClassesOverview = () => {
    // We're keeping setClasses, setLoading, setError, and setBatchTimes because they're used in the fetchClasses function
    const [, setClasses] = useState([]);
    const [, setLoading] = useState(true);
    const [, setError] = useState(null);
    
    // Group classes by time of day (morning/evening)
    const [, setBatchTimes] = useState(defaultBatchTimes);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(true);
                const response = await fetch(ENDPOINTS.ADMIN_CLASSES);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch classes');
                }
                
                const data = await response.json();
                
                // Ensure we have an array of classes
                if (Array.isArray(data) && data.length > 0) {
                    // Filter active classes
                    const activeClasses = data.filter(cls => cls.active !== false);
                    setClasses(activeClasses);
                    
                    // Extract unique batch times and organize by morning/evening
                    const morningTimes = new Set();
                    const eveningTimes = new Set();
                    
                    activeClasses.forEach(cls => {
                        const startHour = new Date(cls.startTime).getHours();
                        // We're removing the unused endHour variable
                        
                        const startTimeStr = formatTime(cls.startTime);
                        const endTimeStr = formatTime(cls.endTime);
                        const timeRange = `${startTimeStr} – ${endTimeStr}`;
                        
                        if (startHour < 12) {
                            morningTimes.add(timeRange);
                        } else {
                            eveningTimes.add(timeRange);
                        }
                    });
                    
                    // Only update batch times if we found some
                    if (morningTimes.size > 0 || eveningTimes.size > 0) {
                        setBatchTimes({
                            morning: Array.from(morningTimes),
                            evening: Array.from(eveningTimes)
                        });
                    }
                }
                
                setError(null);
            } catch (err) {
                console.error('Error fetching classes:', err);
                // Keep using default batch times if fetch fails
            } finally {
                setLoading(false);
            }
        };
        
        fetchClasses();
    }, []);
    
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
    return (
        <section className="bg-gradient-to-r from-orange-100 via-white to-orange-100 py-20 px-6 sm:px-12 lg:px-24" id='classes'>
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-wide">
                    Discover Our Energizing Classes
                </h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-16 leading-relaxed">
                    Whether you want to dance your way to fitness or find your inner calm, our
                    <strong className="text-orange-600"> Zumba + Fitness</strong> and <strong className="text-orange-600">Yoga + Fitness</strong> classes have got you covered.
                    Dive into a vibrant mix of <em>Tabata, Cardio, Weight Training, Power Yoga, Meditation</em>, and more — all designed to energize your body and refresh your mind.
                </p>

                {/* Batch Timings */}
                <div className="bg-white rounded-xl shadow-lg max-w-4xl mx-auto p-10 mb-16">
                    <h3 className="text-2xl font-semibold text-orange-600 mb-6">Batch Timings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 text-left text-gray-800">
                        {/* Morning */}
                        <div>
                            <h4 className="text-lg font-bold mb-4 border-b border-orange-200 pb-2">Morning Batches</h4>
                            <ul className="space-y-3">
                                {['6:00 AM – 7:00 AM', '7:00 AM – 8:00 AM', '8:00 AM – 9:00 AM'].map((time, idx) => (
                                    <li key={idx} className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors duration-300">
                                        <FaClock className="text-orange-500" />
                                        <span className="font-medium">{time}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Evening */}
                        <div>
                            <h4 className="text-lg font-bold mb-4 border-b border-orange-200 pb-2">Evening Batches</h4>
                            <ul className="space-y-3">
                                {['5:00 PM – 6:00 PM', '6:00 PM – 7:00 PM'].map((time, idx) => (
                                    <li key={idx} className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors duration-300">
                                        <FaClock className="text-orange-500" />
                                        <span className="font-medium">{time}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Google Map Embed */}
                <div className="max-w-5xl mx-auto">
                    <h3 className="text-2xl font-semibold text-orange-600 mb-6">Find Us Here</h3>
                    <div className="relative w-full h-0" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3667.7375975730633!2d75.7758373!3d23.1797753!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396375bf09c0b283%3A0xe019322e56ba7e12!2sFly%20fitness%20zone!5e0!3m2!1sen!2sin!4v1748373994644!5m2!1sen!2sin"
                            className="absolute top-0 left-0 w-full h-full border-0"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Fly Fitness Zone Location Map"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClassesOverview;
