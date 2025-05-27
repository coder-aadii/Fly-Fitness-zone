import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Add form submission logic (API call or email service)
        setSubmitted(true);
    };

    return (
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center" id='contact'>

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
                        <p className="text-green-600 text-center font-semibold text-lg">
                            Thank you for contacting us! We will get back to you soon.
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-md transition duration-300"
                                >
                                    Send Message
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
