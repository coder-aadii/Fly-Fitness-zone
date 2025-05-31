import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCog, FaDumbbell, FaCalendarAlt, FaUsers, FaChartLine } from 'react-icons/fa';
import { getImageUrl } from '../../config';

const Sidebar = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 sticky top-4">
      {/* User profile section */}
      <div className="text-center mb-6">
        <div className="h-20 w-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-orange-300">
          {user?.profileImage ? (
            <img 
              src={getImageUrl(user.profileImage)} 
              alt={user.name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-orange-200 flex items-center justify-center">
              <span className="text-orange-500 font-semibold text-2xl">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
          )}
        </div>
        <h3 className="font-semibold text-lg">{user?.name}</h3>
        <p className="text-sm text-gray-500">{user?.email}</p>
        
        <Link 
          to="/UserDashboard" 
          className="mt-3 inline-block text-orange-500 hover:text-orange-600 text-sm"
        >
          View Profile
        </Link>
      </div>
      
      {/* Navigation links */}
      <nav className="space-y-1">
        <Link 
          to="/feed" 
          className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50 text-orange-500"
        >
          <FaUsers className="text-lg" />
          <span>Feed</span>
        </Link>
        
        <Link 
          to="/UserDashboard" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-orange-500"
        >
          <FaUser className="text-lg" />
          <span>My Profile</span>
        </Link>
        
        <Link 
          to="/workouts" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-orange-500"
        >
          <FaDumbbell className="text-lg" />
          <span>Workouts</span>
        </Link>
        
        <Link 
          to="/schedule" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-orange-500"
        >
          <FaCalendarAlt className="text-lg" />
          <span>Schedule</span>
        </Link>
        
        <Link 
          to="/progress" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-orange-500"
        >
          <FaChartLine className="text-lg" />
          <span>Progress</span>
        </Link>
        
        <Link 
          to="/UserSettings" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-orange-500"
        >
          <FaCog className="text-lg" />
          <span>Settings</span>
        </Link>
      </nav>
      
      {/* Expiration notice */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-1">Post Expiration</p>
        <p>All posts automatically expire after 36 hours to keep content fresh and relevant.</p>
      </div>
    </div>
  );
};

export default Sidebar;