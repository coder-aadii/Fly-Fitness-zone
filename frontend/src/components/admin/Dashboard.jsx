import React from 'react';
import { 
    FaUsers, 
    FaCalendarAlt, 
    FaMoneyBillWave, 
    FaNewspaper, 
    FaDumbbell, 
    FaImages, 
    FaComments, 
    FaEnvelope, 
    FaBell,
    FaBan,
    FaStar,
    FaCheckCircle,
    FaTimesCircle
} from 'react-icons/fa';

const Dashboard = ({ stats }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
            
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <FaUsers className="text-blue-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Users</p>
                        <p className="text-2xl font-bold">{stats.totalUsers || 0}</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-green-100 p-3 mr-4">
                        <FaCheckCircle className="text-green-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Active Users</p>
                        <p className="text-2xl font-bold">{stats.activeUsers || 0}</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-red-100 p-3 mr-4">
                        <FaBan className="text-red-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Suspended Users</p>
                        <p className="text-2xl font-bold">{stats.suspendedUsers || 0}</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-purple-100 p-3 mr-4">
                        <FaMoneyBillWave className="text-purple-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold">₹{stats.totalRevenue || 0}</p>
                    </div>
                </div>
            </div>
            
            {/* Content Stats */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Content Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-indigo-100 p-3 mr-4">
                        <FaNewspaper className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Active Posts</p>
                        <p className="text-2xl font-bold">{stats.activePosts || 0}</p>
                        <p className="text-xs text-gray-500">
                            {stats.featuredPosts || 0} featured
                        </p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-orange-100 p-3 mr-4">
                        <FaTimesCircle className="text-orange-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Expired Posts</p>
                        <p className="text-2xl font-bold">{stats.expiredPosts || 0}</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-yellow-100 p-3 mr-4">
                        <FaImages className="text-yellow-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Gallery Images</p>
                        <p className="text-2xl font-bold">{stats.totalGalleryImages || 0}</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-teal-100 p-3 mr-4">
                        <FaComments className="text-teal-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Testimonials</p>
                        <p className="text-2xl font-bold">{stats.totalTestimonials || 0}</p>
                        <p className="text-xs text-gray-500">
                            {stats.pendingTestimonials || 0} pending approval
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Facility Stats */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Facility Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-pink-100 p-3 mr-4">
                        <FaDumbbell className="text-pink-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Trainers</p>
                        <p className="text-2xl font-bold">{stats.totalTrainers || 0}</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-cyan-100 p-3 mr-4">
                        <FaCalendarAlt className="text-cyan-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Classes</p>
                        <p className="text-2xl font-bold">{stats.totalClasses || 0}</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-amber-100 p-3 mr-4">
                        <FaStar className="text-amber-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Featured Content</p>
                        <p className="text-2xl font-bold">{(stats.featuredPosts || 0) + (stats.featuredTestimonials || 0)}</p>
                    </div>
                </div>
            </div>
            
            {/* Communication Stats */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Communication</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-emerald-100 p-3 mr-4">
                        <FaEnvelope className="text-emerald-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Contact Messages</p>
                        <p className="text-2xl font-bold">{stats.totalContacts || 0}</p>
                        <p className="text-xs text-gray-500">
                            {stats.unresolvedContacts || 0} unresolved
                        </p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-violet-100 p-3 mr-4">
                        <FaBell className="text-violet-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Push Notifications</p>
                        <p className="text-2xl font-bold">{stats.totalNotifications || 0}</p>
                        <p className="text-xs text-gray-500">
                            Sent to users
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;