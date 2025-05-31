import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { getImageUrl } from '../../config';

const UserNavbar = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        // Clear user data from localStorage or context
        localStorage.removeItem('token');
        // Redirect to home page
        navigate('/');
    };

    return (
        <nav className="bg-orange-500 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/UserDashboard" className="flex-shrink-0 flex items-center">
                            <img
                                className="h-8 w-auto"
                                src="https://res.cloudinary.com/deoegf9on/image/upload/v1748418441/logo_img_jw4nn6.png"
                                alt="Fly Fitness Zone"
                            />
                            <span className="ml-2 text-xl font-bold">Fly Fitness Zone</span>
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {/* <Link to="/UserDashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-600">
                            Dashboard
                        </Link> */}
                        {/* <Link to="/classes" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-600">
                            Classes
                        </Link> */}
                        {/* <Link to="/schedule" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-600">
                            My Schedule
                        </Link>
                        <Link to="/album" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-600">
                            Gallery
                        </Link> */}

                        {/* User dropdown */}
                        <div className="relative ml-3">
                            <div>
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-orange-600 focus:ring-white"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-orange-300 flex items-center justify-center overflow-hidden">
                                        {user?.profileImage ? (
                                            <img 
                                                src={getImageUrl(user.profileImage)} 
                                                alt={user.name} 
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <FaUser className="h-5 w-5 text-orange-800" />
                                        )}
                                    </div>
                                    <span className="ml-2">{user?.name || 'User'}</span>
                                </button>
                            </div>

                            {dropdownOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    {/* <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Your Profile
                                    </Link> */}
                                    <Link
                                        to="/UserSettings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <FaTimes className="block h-6 w-6" />
                            ) : (
                                <FaBars className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {/* <Link
                            to="/UserDashboard"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-600"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/classes"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-600"
                        >
                            Classes
                        </Link>
                        <Link
                            to="/schedule"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-600"
                        >
                            My Schedule
                        </Link>
                        <Link
                            to="/album"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-600"
                        >
                            Gallery
                        </Link> */}
                    </div>
                    <div className="pt-4 pb-3 border-t border-orange-600">
                        <div className="flex items-center px-5">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-orange-300 flex items-center justify-center overflow-hidden">
                                    {user?.profileImage ? (
                                        <img 
                                            src={getImageUrl(user.profileImage)} 
                                            alt={user.name} 
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <FaUser className="h-6 w-6 text-orange-800" />
                                    )}
                                </div>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium">{user?.name || 'User'}</div>
                            </div>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            {/* <Link
                                to="/profile"
                                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-600"
                            >
                                Your Profile
                            </Link> */}
                            <Link
                                to="/UserSettings"
                                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-600"
                            >
                                Settings
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-orange-600"
                            >
                                <div className="flex items-center">
                                    <FaSignOutAlt className="mr-2" />
                                    Sign out
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default UserNavbar;