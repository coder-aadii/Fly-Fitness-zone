import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const HeroSection = () => {
    return (
        <section className="relative h-screen overflow-hidden">
            {/* Video Background */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                src="https://res.cloudinary.com/deoegf9on/video/upload/v1748370065/ffz_tcanid.mp4"
                autoPlay
                loop
                muted
                playsInline
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
                <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                    Transform Your Body
                    <br />
                    <span className="text-orange-500">Elevate Your Fitness</span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
                    Join Fly Fitness Zone today and embark on a journey to a healthier, stronger you.
                </p>
                <div className="mt-8 flex justify-center space-x-4">
                    <Link
                        to="/register"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
                    >
                        Join Now
                    </Link>
                    <Link
                        to="/album"
                        className="bg-white hover:bg-gray-100 text-orange-600 font-semibold py-3 px-6 rounded-md transition duration-300 flex items-center justify-center"
                    >
                        Know About Classes
                    </Link>
                </div>
                
                {/* Social Media Icons */}
                <div className="mt-8 flex justify-center space-x-6">
                    <a 
                        href="https://www.instagram.com/flyfitnesszone?igsh=MXkxaDNvOWFxZXpnMg==?" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        aria-label="Follow us on Instagram"
                    >
                        <FaInstagram className="text-xl" />
                    </a>
                    <a 
                        href="https://www.facebook.com/flyfitnesszone" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        aria-label="Follow us on Facebook"
                    >
                        <FaFacebookF className="text-xl" />
                    </a>
                    <a 
                        href="https://wa.me/919406681919" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        aria-label="Contact us on WhatsApp"
                    >
                        <FaWhatsapp className="text-xl" />
                    </a>
                    <a 
                        href="mailto:flyfitnesszone27@gmail.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        aria-label="Email us"
                    >
                        <MdEmail className="text-xl" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
