import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react'; // You can also use Heroicons
import logo from '../assets/images/logo_img.png'; // Replace with actual logo path
import { getImageUrl } from '../config'; // Import the helper function
import { useAuth } from '../context/AuthContext'; // Import the auth context

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const userMenuRef = React.useRef(null);
    
    // Use the auth context
    const { isLoggedIn, userData, logout } = useAuth();
    
    // No need for login status checks anymore since we're using AuthContext
    
    // Handle clicks outside of user menu to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handleLogout = () => {
        // Close the user menu
        setShowUserMenu(false);
        
        // Use the logout function from AuthContext
        logout();
        
        // Navigate to home page
        navigate('/');
    };

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
                        <a href="#offerings" onClick={(e) => handleAnchorClick(e, "#offerings")} className="hover:text-red-600 transition">Offerings</a>
                        <a href="#about" onClick={(e) => handleAnchorClick(e, "#about")} className="hover:text-red-600 transition">About Us</a>
                        <a href="#classes" onClick={(e) => handleAnchorClick(e, "#classes")} className="hover:text-red-600 transition">Classes</a>
                        <a href="#trainers" onClick={(e) => handleAnchorClick(e, "#trainers")} className="hover:text-red-600 transition">Trainers</a>
                        <a href="#contact" onClick={(e) => handleAnchorClick(e, "#contact")} className="hover:text-red-600 transition">Contact Us</a>
                        
                        {isLoggedIn ? (
                            <>
                                <div className="relative" ref={userMenuRef}>
                                    <div className="flex items-center space-x-2">
                                        {/* Show News Feed link only for regular users, not for admins */}
                                        {/* {userData && userData.role !== 'admin' && (
                                            <Link to="/feed" className="hover:text-red-600 transition font-medium text-orange-600">News Feed</Link>
                                        )} */}
                                        <button 
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                            className="hover:text-red-600 transition flex items-center"
                                        >
                                            {userData && userData.profileImage ? (
                                                <img 
                                                    src={getImageUrl(userData.profileImage)}
                                                    alt="Profile" 
                                                    className="h-6 w-6 rounded-full object-cover mr-1"
                                                />
                                            ) : null}
                                            <span className="text-sm font-medium">
                                                {userData ? (userData.name || userData.email || 'Account') : 'Account'} ▼
                                            </span>
                                        </button>
                                    </div>
                                    
                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1">
                                            {/* For admin users */}
                                            {userData && userData.role === 'admin' ? (
                                                <>
                                                    <Link 
                                                        to="/admin-dashboard" 
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        Admin Dashboard
                                                    </Link>
                                                </>
                                            ) : (
                                                <>
                                                    <Link 
                                                        to="/feed" 
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        News Feed
                                                    </Link>
                                                    <Link 
                                                        to="/UserDashboard" 
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        Dashboard
                                                    </Link>
                                                    <Link 
                                                        to="/UserSettings" 
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        Settings
                                                    </Link>
                                                </>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <LogOut className="inline mr-2 h-4 w-4" />
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link to="/login" className="hover:text-red-600 transition">Login</Link>
                        )}
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
                    <a href="#offerings" onClick={(e) => handleAnchorClick(e, "#offerings")} className="block py-2 text-gray-700 hover:text-red-600">Offerings</a>
                    <a href="#about" onClick={(e) => handleAnchorClick(e, "#about")} className="block py-2 text-gray-700 hover:text-red-600">About Us</a>
                    <a href="#classes" onClick={(e) => handleAnchorClick(e, "#classes")} className="block py-2 text-gray-700 hover:text-red-600">Classes</a>
                    <a href="#trainers" onClick={(e) => handleAnchorClick(e, "#trainers")} className="block py-2 text-gray-700 hover:text-red-600">Trainers</a>
                    <a href="#contact" onClick={(e) => handleAnchorClick(e, "#contact")} className="block py-2 text-gray-700 hover:text-red-600">Contact Us</a>
                    
                    {isLoggedIn ? (
                        <>
                            {/* For admin users */}
                            {userData && userData.role === 'admin' ? (
                                <>
                                    <Link 
                                        to="/admin-dashboard" 
                                        onClick={() => setMenuOpen(false)} 
                                        className="block py-2 font-medium text-orange-600 hover:text-red-600"
                                    >
                                        Admin Dashboard
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/feed" 
                                        onClick={() => setMenuOpen(false)} 
                                        className="block py-2 font-medium text-orange-600 hover:text-red-600"
                                    >
                                        News Feed
                                    </Link>
                                    <Link 
                                        to="/UserDashboard" 
                                        onClick={() => setMenuOpen(false)} 
                                        className="block py-2 text-gray-700 hover:text-red-600"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link 
                                        to="/UserSettings" 
                                        onClick={() => setMenuOpen(false)} 
                                        className="block py-2 text-gray-700 hover:text-red-600"
                                    >
                                        Settings
                                    </Link>
                                </>
                            )}
                            <button 
                                onClick={() => {
                                    handleLogout();
                                    setMenuOpen(false);
                                }} 
                                className="block w-full text-left py-2 text-gray-700 hover:text-red-600"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-red-600">Login</Link>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;