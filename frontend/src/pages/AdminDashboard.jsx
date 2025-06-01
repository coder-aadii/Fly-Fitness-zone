import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaMoneyBillWave, FaSignOutAlt } from 'react-icons/fa';
import { ENDPOINTS } from '../config';

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
        <div className="min-h-screen bg-gray-100">
            {/* Admin Header */}
            <header className="bg-orange-600 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
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
                            <FaUsers className="text-green-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Active Users</p>
                            <p className="text-2xl font-bold">{stats.activeUsers || 0}</p>
                            <p className="text-xs text-gray-500">Verified accounts</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                        <div className="rounded-full bg-yellow-100 p-3 mr-4">
                            <FaCalendarAlt className="text-yellow-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Pending Payments</p>
                            <p className="text-2xl font-bold">{stats.pendingPayments || 0}</p>
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
                
                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="font-semibold text-gray-800 mb-2">New Users (30 days)</h3>
                        <p className="text-2xl font-bold text-blue-600">{stats.newUsersLast30Days || 0}</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Pending Verification</h3>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pendingVerification || 0}</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Complete Profiles</h3>
                        <p className="text-2xl font-bold text-green-600">{stats.usersWithCompleteProfile || 0}</p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Registered Users</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                                    user.status === 'Inactive' ? 'bg-red-100 text-red-800' : 
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.joiningDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.profileComplete ? (
                                                    <span className="text-green-600">Complete</span>
                                                ) : (
                                                    <span className="text-red-600">Incomplete</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;