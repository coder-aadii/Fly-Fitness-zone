import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // You can also use Heroicons
import logo from '../assets/images/logo_img.png'; // Replace with actual logo path

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const handleAnchorClick = (e, anchor) => {
        e.preventDefault();
        // If not already on the homepage, navigate to home and then scroll
        if (location.pathname !== "/") {
            window.location.href = "/" + anchor; // This reloads home and jumps to anchor
        } else {
            const section = document.getElementById(anchor.replace("#", ""));
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        }
        setMenuOpen(false); // Always close menu after click (for mobile)
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <a href="/" className="flex items-center space-x-2">
                        <img src={logo} alt="Fly Fitness Logo" className="h-10 w-auto" />
                        <span className="text-xl font-bold text-red-600">Fly Fitness Zone</span>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-6 font-medium text-gray-700">
                        <a href="/" className="hover:text-red-600 transition">Home</a>
                        <a href="#about" onClick={(e) => handleAnchorClick(e, "#about")} className="hover:text-red-600 transition">About Us</a>
                        <a href="#classes" onClick={(e) => handleAnchorClick(e, "#classes")} className="hover:text-red-600 transition">Classes</a>
                        <a href="#trainers" onClick={(e) => handleAnchorClick(e, "#trainers")} className="hover:text-red-600 transition">Trainers</a>
                        <a href="#contact" onClick={(e) => handleAnchorClick(e, "#contact")} className="hover:text-red-600 transition">Contact Us</a>
                        <Link to="/login" className="hover:text-red-600 transition">Login</Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 focus:outline-none">
                            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white shadow-md px-4 pb-4">
                    <a href="/" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-red-600">Home</a>
                    <a href="#about" onClick={(e) => handleAnchorClick(e, "#about")} className="block py-2 text-gray-700 hover:text-red-600">About Us</a>
                    <a href="#classes" onClick={(e) => handleAnchorClick(e, "#classes")} className="block py-2 text-gray-700 hover:text-red-600">Classes</a>
                    <a href="#trainers" onClick={(e) => handleAnchorClick(e, "#trainers")} className="block py-2 text-gray-700 hover:text-red-600">Trainers</a>
                    <a href="#contact" onClick={(e) => handleAnchorClick(e, "#contact")} className="block py-2 text-gray-700 hover:text-red-600">Contact Us</a>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-red-600">Login</Link>
                </div>
            )}
        </header>
    );
};

export default Header;