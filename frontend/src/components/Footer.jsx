import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    // Smooth scroll handler for footer quick links
    const handleScroll = (e, anchor) => {
        e.preventDefault();
        if (!anchor) {
            // Scroll to top of the page
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const section = document.getElementById(anchor);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };


    return (
        <footer className="bg-gray-900 text-gray-300 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* About */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">Fly Fitness Zone</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Your journey to a healthier and stronger body starts here. Join our community and embrace the fitness lifestyle with expert trainers and diverse classes.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <button
                            onClick={(e) => handleScroll(e, "")}
                            className="hover:text-orange-500 transition cursor-pointer"
                        >
                            Home
                        </button>
                        <li>
                            <button
                                onClick={(e) => handleScroll(e, "about")}
                                className="hover:text-orange-500 transition cursor-pointer"
                            >
                                About Us
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={(e) => handleScroll(e, "classes")}
                                className="hover:text-orange-500 transition cursor-pointer"
                            >
                                Classes
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={(e) => handleScroll(e, "trainers")}
                                className="hover:text-orange-500 transition cursor-pointer"
                            >
                                Trainers
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={(e) => handleScroll(e, "contact")}
                                className="hover:text-orange-500 transition cursor-pointer"
                            >
                                Contact
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">Contact Info</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <FaMapMarkerAlt className="mr-3 text-orange-500 mt-1" />
                            <span>
                                Dudhtlai, in front of Anaaj Mandi,<br />
                                Above Mama Road Lines,<br />
                                Indore-Gate, Ujjain, Madhya Pradesh 456001
                            </span>
                        </li>
                        <li className="flex items-start">
                            <FaPhoneAlt className="mt-1 mr-3 text-orange-500" />
                            <div className="flex flex-col">
                                <a href="tel:+919406681919" className="hover:text-orange-500 transition block">
                                    +91 94066 81919
                                </a>
                                <a href="tel:+919074703157" className="hover:text-orange-500 transition block">
                                    +91 90747 03157
                                </a>
                            </div>
                        </li>

                        <li className="flex items-center">
                            <FaEnvelope className="mr-3 text-orange-500" />
                            <a href="mailto:flyfitnesszone27@gmail.com" className="hover:text-orange-500 transition">contact@flyfitnesszone.com</a>
                        </li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
                    <div className="flex space-x-6">
                        <a href="https://facebook.com/flyfitnesszone" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-orange-500 transition">
                            <FaFacebookF size={24} />
                        </a>
                        <a href="https://instagram.com/flyfitnesszone" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-orange-500 transition">
                            <FaInstagram size={24} />
                        </a>
                        <a href="https://twitter.com/flyfitnesszone" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-orange-500 transition">
                            <FaTwitter size={24} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="text-center text-gray-500 mt-12 text-sm">
                &copy; {new Date().getFullYear()} Fly Fitness Zone. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
