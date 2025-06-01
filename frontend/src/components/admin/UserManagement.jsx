import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserSlash, FaUserCheck, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { ENDPOINTS } from '../../config';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [suspensionReason, setSuspensionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(ENDPOINTS.ADMIN_USERS, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSuspendUser = async () => {
        if (!selectedUser || !suspensionReason.trim()) return;
        
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_USERS}/${selectedUser.id}/suspend`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason: suspensionReason })
            });

            if (!response.ok) {
                throw new Error('Failed to suspend user');
            }

            // Update local state
            setUsers(users.map(user => 
                user.id === selectedUser.id 
                    ? { ...user, status: 'Suspended', suspended: true, suspensionReason } 
                    : user
            ));
            
            // Close modal and reset
            setShowSuspendModal(false);
            setSuspensionReason('');
            setSelectedUser(null);
        } catch (err) {
            console.error('Error suspending user:', err);
            setError('Failed to suspend user. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnsuspendUser = async (user) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_USERS}/${user.id}/unsuspend`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to unsuspend user');
            }

            // Update local state
            setUsers(users.map(u => 
                u.id === user.id 
                    ? { ...u, status: 'Active', suspended: false, suspensionReason: null } 
                    : u
            ));
        } catch (err) {
            console.error('Error unsuspending user:', err);
            setError('Failed to unsuspend user. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_USERS}/${selectedUser.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            // Update local state
            setUsers(users.filter(user => user.id !== selectedUser.id));
            
            // Close modal and reset
            setShowDeleteModal(false);
            setSelectedUser(null);
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Failed to delete user. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
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
                                                user.status === 'Suspended' ? 'bg-red-100 text-red-800' : 
                                                'bg-yellow-100 text-yellow-800'}`}>
                                                {user.status}
                                            </span>
                                            {user.status === 'Suspended' && user.suspensionReason && (
                                                <div className="text-xs text-red-500 mt-1">
                                                    Reason: {user.suspensionReason}
                                                </div>
                                            )}
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {user.status === 'Suspended' ? (
                                                    <button
                                                        onClick={() => handleUnsuspendUser(user)}
                                                        disabled={actionLoading}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Unsuspend User"
                                                    >
                                                        <FaUserCheck size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowSuspendModal(true);
                                                        }}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                        title="Suspend User"
                                                    >
                                                        <FaUserSlash size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete User"
                                                >
                                                    <FaTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        {searchTerm ? 'No users match your search.' : 'No users found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Suspend User Modal */}
            {showSuspendModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Suspend User</h3>
                        <p className="mb-4">
                            Are you sure you want to suspend <span className="font-semibold">{selectedUser?.name}</span>?
                            This will prevent them from logging in or posting content.
                        </p>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Reason for suspension</label>
                            <textarea
                                value={suspensionReason}
                                onChange={(e) => setSuspensionReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                rows="3"
                                placeholder="Enter reason for suspension"
                                required
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowSuspendModal(false);
                                    setSelectedUser(null);
                                    setSuspensionReason('');
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSuspendUser}
                                disabled={!suspensionReason.trim() || actionLoading}
                                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${
                                    !suspensionReason.trim() || actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {actionLoading ? 'Processing...' : 'Suspend User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete User Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center mb-4 text-red-600">
                            <FaExclamationTriangle size={24} className="mr-2" />
                            <h3 className="text-xl font-bold">Delete User</h3>
                        </div>
                        <p className="mb-4">
                            Are you sure you want to permanently delete <span className="font-semibold">{selectedUser?.name}</span>?
                            This action cannot be undone and will remove all associated data including posts and account information.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedUser(null);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                disabled={actionLoading}
                                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${
                                    actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {actionLoading ? 'Processing...' : 'Delete User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;