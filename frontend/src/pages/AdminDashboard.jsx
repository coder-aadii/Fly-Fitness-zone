import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    FaUsers, 
    FaCalendarAlt, 
    FaSignOutAlt, 
    FaTachometerAlt, 
    FaNewspaper, 
    FaDumbbell, 
    FaImages, 
    FaComments, 
    FaEnvelope, 
    FaBell,
    FaBars,
    FaTimes,
    FaHome,
    FaLock,
    FaBullhorn
} from 'react-icons/fa';
import { ENDPOINTS } from '../config';

// Import admin panel components
import Dashboard from '../components/admin/Dashboard';
import UserManagement from '../components/admin/UserManagement';
import PostModeration from '../components/admin/PostModeration';
import TrainerManagement from '../components/admin/TrainerManagement';
import ClassSchedule from '../components/admin/ClassSchedule';
import GalleryManagement from '../components/admin/GalleryManagement';
import TestimonialModeration from '../components/admin/TestimonialModeration';
import ContactMessages from '../components/admin/ContactMessages';
import PushNotifications from '../components/admin/PushNotifications';
import LandingPageContent from '../components/admin/LandingPageContent';
import ChangePassword from '../components/admin/ChangePassword';
import MotivationalMessages from '../components/admin/MotivationalMessages';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        pendingPayments: 0,
        totalRevenue: 0
    });
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAdmin = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Try to decode the token locally first
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));

                    const decodedToken = JSON.parse(jsonPayload);
                    
                    if (decodedToken.role !== 'admin') {
                        navigate('/unauthorized');
                        return;
                    }
                } catch (error) {
                    // If token decoding fails, continue to API verification
                }

                // Fetch admin data
                try {
                    const response = await fetch(ENDPOINTS.ADMIN_PROFILE, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        if (response.status === 401) {
                            localStorage.removeItem('token');
                            navigate('/login');
                            return;
                        }
                        throw new Error('Failed to fetch admin data');
                    }

                    const userData = await response.json();
                    
                    // Check if user is admin
                    if (!userData.role || userData.role !== 'admin') {
                        navigate('/unauthorized');
                        return;
                    }
                } catch (error) {
                    console.error('Error fetching admin profile:', error);
                    setError('Failed to verify admin status. Please try logging in again.');
                    setLoading(false);
                    return;
                }

                // Fetch stats and users in parallel
                try {
                    const [statsResponse, usersResponse] = await Promise.allSettled([
                        fetch(ENDPOINTS.ADMIN_STATS, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }),
                        fetch(ENDPOINTS.ADMIN_USERS, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                    ]);
                    
                    // Handle stats response
                    if (statsResponse.status === 'fulfilled' && statsResponse.value.ok) {
                        const statsData = await statsResponse.value.json();
                        setStats(statsData);
                    } else {
                        console.warn('Failed to fetch statistics');
                        // Use default stats instead of showing an error
                        setStats({
                            totalUsers: 0,
                            activeUsers: 0,
                            pendingPayments: 0,
                            totalRevenue: 0,
                            newUsersLast30Days: 0,
                            pendingVerification: 0,
                            usersWithCompleteProfile: 0
                        });
                    }
                    
                    // Handle users response
                    if (usersResponse.status === 'fulfilled' && usersResponse.value.ok) {
                        const usersData = await usersResponse.value.json();
                        setUsers(usersData);
                    } else {
                        console.warn('Failed to fetch user data');
                        // Use empty array instead of showing an error
                        setUsers([]);
                    }
                } catch (error) {
                    console.error('Error fetching admin data:', error);
                    // Don't set error, just use default values
                    setStats({
                        totalUsers: 0,
                        activeUsers: 0,
                        pendingPayments: 0,
                        totalRevenue: 0
                    });
                    setUsers([]);
                } finally {
                    setLoading(false);
                }
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        verifyAdmin();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Function to render the active component based on the selected tab
    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard stats={stats} />;
            case 'landing':
                return <LandingPageContent />;
            case 'users':
                return <UserManagement users={users} />;
            case 'posts':
                return <PostModeration />;
            case 'trainers':
                return <TrainerManagement />;
            case 'classes':
                return <ClassSchedule />;
            case 'gallery':
                return <GalleryManagement />;
            case 'testimonials':
                return <TestimonialModeration />;
            case 'contacts':
                return <ContactMessages />;
            case 'notifications':
                return <PushNotifications />;
            case 'motivational':
                return <MotivationalMessages />;
            case 'password':
                return <ChangePassword />;
            default:
                return <Dashboard stats={stats} />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6">
                <p className="text-red-500">Error: {error}</p>
                <button 
                    onClick={() => navigate('/login')} 
                    className="mt-4 bg-orange-500 text-white px-4 py-2 rounded"
                >
                    Return to Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Admin Header - Fixed at the top with high z-index */}
            <header className="bg-orange-600 text-white shadow-md fixed top-0 left-0 right-0 z-1000">
                <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="mr-4 text-white focus:outline-none lg:hidden"
                        >
                            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                        <Link to="/admin-dashboard" className="flex items-center mr-6">
                            <img 
                                src="/logo192.png" 
                                alt="Fly Fitness Zone" 
                                className="h-8 w-auto mr-2"
                            />
                            <h1 className="text-2xl font-bold">Fly Fitness Zone Admin</h1>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={handleLogout}
                            className="flex items-center bg-orange-700 hover:bg-orange-800 px-4 py-2 rounded"
                        >
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Add a spacer to account for the fixed header */}
            <div className="h-16"></div>
            
            <div className="flex flex-1 overflow-hidden">
                {/* Mobile overlay when sidebar is open */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-990 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}
                
                {/* Sidebar - Fixed on the left */}
                <aside className={`bg-gray-800 text-white w-64 flex-shrink-0 fixed top-16 bottom-0 left-0 overflow-y-auto z-995 ${sidebarOpen ? 'block' : 'hidden'} lg:block transition-all duration-300 ease-in-out`}>
                    <nav className="mt-5 px-2">
                        <div className="space-y-1">
                            <button 
                                onClick={() => setActiveTab('dashboard')}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'dashboard' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            >
                                <FaTachometerAlt className="mr-3 h-5 w-5" />
                                Dashboard
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('landing')}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'landing' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            >
                                <FaHome className="mr-3 h-5 w-5" />
                                Landing Page Content
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('users')}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'users' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            >
                                <FaUsers className="mr-3 h-5 w-5" />
                                User Management
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('posts')}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'posts' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            >
                                <FaNewspaper className="mr-3 h-5 w-5" />
                                Post Moderation
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('trainers')}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'trainers' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            >
                                <FaDumbbell className="mr-3 h-5 w-5" />
                                Trainer Management
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('classes')}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'classes' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            >
                                <FaCalendarAlt className="mr-3 h-5 w-5" />
                                Class Schedule
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('gallery')}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'gallery' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            >
                                <FaImages className="mr-3 h-5 w-5" />
                                Gallery Management
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('testimonials')}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'testimonials' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            >
                                <FaComments className="mr-3 h-5 w-5" />
                                Testimonials
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('contacts')}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'contacts' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            >
                                <FaEnvelope className="mr-3 h-5 w-5" />
                                Contact Messages
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('notifications')}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'notifications' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            >
                                <FaBell className="mr-3 h-5 w-5" />
                                Push Notifications
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('motivational')}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'motivational' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            >
                                <FaBullhorn className="mr-3 h-5 w-5" />
                                Motivational Messages
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('password')}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'password' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            >
                                <FaLock className="mr-3 h-5 w-5" />
                                Change Password
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Main content - Add left margin to account for the fixed sidebar */}
                <main className="flex-1 overflow-auto p-6 ml-0 lg:ml-64 mt-0 pb-16">
                    {renderActiveComponent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;