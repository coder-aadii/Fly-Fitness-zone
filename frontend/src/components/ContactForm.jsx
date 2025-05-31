import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // Get the API URL from environment or use default
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            
            // Send the form data to the backend
            const response = await axios.post(`${apiUrl}/api/contact`, formData);
            
            if (response.data.success) {
                setSubmitted(true);
                // Reset form data
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                });
            } else {
                setError(response.data.message || 'Failed to send message. Please try again.');
            }
        } catch (err) {
            console.error('Contact form submission error:', err);
            setError(
                err.response?.data?.message || 
                'Failed to send message. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="bg-white py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Image on left side */}
                <div className="hidden md:block">
                    <img
                        src="https://res.cloudinary.com/deoegf9on/image/upload/v1748372831/Picsart_25-05-28_00-36-29-353_ztxgo0.jpg"
                        alt="Contact us illustration"
                        className="w-full h-auto rounded-lg shadow-lg object-cover"
                    />
                </div>

                {/* Form */}
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center md:text-left">
                        Contact Us
                    </h2>

                    {submitted ? (
                        <div className="text-center">
                            <p className="text-green-600 font-semibold text-lg mb-4">
                                Thank you for contacting us! We will get back to you soon.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="text-orange-500 hover:text-orange-600 font-medium"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Your full name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Write your message here..."
                                ></textarea>
                            </div>

                            <div className="text-center md:text-left">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`${
                                        loading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-orange-500 hover:bg-orange-600'
                                    } text-white font-semibold py-3 px-8 rounded-md transition duration-300 flex items-center justify-center`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* For small screens: show image above form */}
            <div className="block md:hidden mt-8">
                <img
                    src="https://res.cloudinary.com/deoegf9on/image/upload/v1748372831/Picsart_25-05-28_00-36-29-353_ztxgo0.jpg"
                    alt="Contact us illustration"
                    className="w-full h-auto rounded-lg shadow-lg object-cover"
                />
            </div>
        </section>
    );
};

export default ContactForm;
