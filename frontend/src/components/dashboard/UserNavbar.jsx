import React from 'react';
import { FiLogOut, FiUser, FiHome } from 'react-icons/fi';

const UserNavbar = ({ onLogout, userName = 'Member' }) => {
    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            {/* Brand */}
            <div className="flex items-center space-x-2">
                <FiHome className="text-orange-500 text-2xl" />
                <h1 className="text-xl font-bold text-orange-600">Fly Fitness Zone</h1>
            </div>

            {/* Links */}
            <ul className="flex items-center space-x-6 text-gray-700 font-medium">
                <li className="hover:text-orange-500 cursor-pointer">Dashboard</li>
                <li className="hover:text-orange-500 cursor-pointer">My Profile</li>
                <li className="hover:text-orange-500 cursor-pointer">Fees</li>
                <li className="hover:text-orange-500 cursor-pointer">Classes</li>
            </ul>

            {/* User Info */}
            <div className="flex items-center space-x-4">
                <FiUser className="text-xl text-gray-600" />
                <span className="text-gray-700 font-semibold">{userName}</span>
                <button
                    onClick={onLogout}
                    className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg"
                >
                    <FiLogOut className="mr-1" />
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default UserNavbar;
