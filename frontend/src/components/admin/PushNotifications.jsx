import React, { useState, useEffect } from 'react';
import { FaBell, FaHistory, FaUsers, FaUserTag, FaCalendarAlt, FaExclamationTriangle, FaPaperPlane } from 'react-icons/fa';
import { ENDPOINTS } from '../../config';

const PushNotifications = () => {
    const [notificationData, setNotificationData] = useState({
        title: '',
        message: '',
        targetType: 'all', // 'all', 'specific', 'membership'
        targetUsers: [],
        membershipType: '',
        scheduledTime: '',
        sendNow: true
    });
    
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [availableUsers, setAvailableUsers] = useState([]);
    // We're removing the unused setMembershipTypes variable
    const [membershipTypes] = useState([
        'Free', 'Basic', 'Premium', 'Elite'
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        fetchNotificationHistory();
        fetchAvailableUsers();
    }, []);

    const fetchNotificationHistory = async () => {
        try {
            setHistoryLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(ENDPOINTS.ADMIN_NOTIFICATIONS_HISTORY, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notification history');
            }

            const data = await response.json();
            setNotifications(data);
        } catch (err) {
            console.error('Error fetching notification history:', err);
            setError('Failed to load notification history. Please try again.');
        } finally {
            setHistoryLoading(false);
        }
    };

    const fetchAvailableUsers = async () => {
        try {
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
            setAvailableUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNotificationData({
            ...notificationData,
            [name]: value
        });
    };

    const handleTargetTypeChange = (e) => {
        const targetType = e.target.value;
        setNotificationData({
            ...notificationData,
            targetType,
            targetUsers: [],
            membershipType: ''
        });
    };

    const handleScheduleToggle = (e) => {
        const sendNow = e.target.checked;
        setNotificationData({
            ...notificationData,
            sendNow,
            scheduledTime: sendNow ? '' : notificationData.scheduledTime
        });
    };

    const handleUserSelection = (userId) => {
        const isSelected = selectedUsers.includes(userId);
        
        if (isSelected) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const confirmSelectedUsers = () => {
        setNotificationData({
            ...notificationData,
            targetUsers: selectedUsers
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };

    const sendNotification = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            
            const token = localStorage.getItem('token');
            
            const payload = {
                title: notificationData.title,
                message: notificationData.message,
                targetType: notificationData.targetType,
                sendNow: notificationData.sendNow
            };
            
            if (notificationData.targetType === 'specific') {
                payload.targetUsers = notificationData.targetUsers;
            } else if (notificationData.targetType === 'membership') {
                payload.membershipType = notificationData.membershipType;
            }
            
            if (!notificationData.sendNow) {
                payload.scheduledTime = new Date(notificationData.scheduledTime).toISOString();
            }
            
            const response = await fetch(ENDPOINTS.ADMIN_SEND_NOTIFICATION, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to send notification');
            }

            setSuccess('Notification sent successfully!');
            setNotificationData({
                title: '',
                message: '',
                targetType: 'all',
                targetUsers: [],
                membershipType: '',
                scheduledTime: '',
                sendNow: true
            });
            setSelectedUsers([]);
            
            // Refresh notification history
            fetchNotificationHistory();
        } catch (err) {
            console.error('Error sending notification:', err);
            setError('Failed to send notification. Please try again.');
        } finally {
            setLoading(false);
            setShowConfirmModal(false);
        }
    };

    // Filter users based on search term
    const filteredUsers = availableUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Push Notifications</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Notification Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <FaBell className="mr-2 text-orange-500" />
                        Send New Notification
                    </h3>
                    
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                            <p>{success}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                Notification Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={notificationData.title}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter notification title"
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                                Notification Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={notificationData.message}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter notification message"
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Target Recipients
                            </label>
                            <div className="flex flex-wrap gap-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="targetType"
                                        value="all"
                                        checked={notificationData.targetType === 'all'}
                                        onChange={handleTargetTypeChange}
                                        className="form-radio h-4 w-4 text-orange-500"
                                    />
                                    <span className="ml-2">All Users</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="targetType"
                                        value="specific"
                                        checked={notificationData.targetType === 'specific'}
                                        onChange={handleTargetTypeChange}
                                        className="form-radio h-4 w-4 text-orange-500"
                                    />
                                    <span className="ml-2">Specific Users</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="targetType"
                                        value="membership"
                                        checked={notificationData.targetType === 'membership'}
                                        onChange={handleTargetTypeChange}
                                        className="form-radio h-4 w-4 text-orange-500"
                                    />
                                    <span className="ml-2">By Membership Type</span>
                                </label>
                            </div>
                        </div>
                        
                        {notificationData.targetType === 'specific' && (
                            <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-gray-700">Select Users</h4>
                                    <span className="text-sm text-gray-500">
                                        {selectedUsers.length} users selected
                                    </span>
                                </div>
                                
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                
                                <div className="max-h-60 overflow-y-auto mb-3 border border-gray-200 rounded">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map(user => (
                                            <div 
                                                key={user.id} 
                                                className={`flex items-center p-2 hover:bg-gray-50 cursor-pointer ${
                                                    selectedUsers.includes(user.id) ? 'bg-orange-50' : ''
                                                }`}
                                                onClick={() => handleUserSelection(user.id)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => {}}
                                                    className="form-checkbox h-4 w-4 text-orange-500 mr-3"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-800">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="p-3 text-gray-500 text-center">No users found</p>
                                    )}
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={confirmSelectedUsers}
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                                >
                                    Confirm Selection
                                </button>
                            </div>
                        )}
                        
                        {notificationData.targetType === 'membership' && (
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="membershipType">
                                    Membership Type
                                </label>
                                <select
                                    id="membershipType"
                                    name="membershipType"
                                    value={notificationData.membershipType}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required={notificationData.targetType === 'membership'}
                                >
                                    <option value="">Select Membership Type</option>
                                    {membershipTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="sendNow"
                                    checked={notificationData.sendNow}
                                    onChange={handleScheduleToggle}
                                    className="form-checkbox h-4 w-4 text-orange-500"
                                />
                                <label className="ml-2 text-gray-700 text-sm font-bold" htmlFor="sendNow">
                                    Send Immediately
                                </label>
                            </div>
                            
                            {!notificationData.sendNow && (
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scheduledTime">
                                        Schedule Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="scheduledTime"
                                        name="scheduledTime"
                                        value={notificationData.scheduledTime}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required={!notificationData.sendNow}
                                    />
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center justify-end">
                            <button
                                type="submit"
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                                disabled={loading}
                            >
                                <FaPaperPlane className="mr-2" />
                                {loading ? 'Sending...' : 'Send Notification'}
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Notification History */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <FaHistory className="mr-2 text-orange-500" />
                        Notification History
                    </h3>
                    
                    {historyLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {notifications.map(notification => (
                                <div key={notification._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold text-gray-800">{notification.title}</h4>
                                        <span className="text-xs text-gray-500">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mt-2">{notification.message}</p>
                                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-3">
                                        <div className="flex items-center text-xs text-gray-500">
                                            <FaUsers className="mr-1" />
                                            <span>
                                                {notification.targetType === 'all' 
                                                    ? 'All Users' 
                                                    : notification.targetType === 'specific'
                                                    ? 'Specific Users'
                                                    : 'By Membership'}
                                            </span>
                                        </div>
                                        
                                        {notification.targetType === 'membership' && (
                                            <div className="flex items-center text-xs text-gray-500">
                                                <FaUserTag className="mr-1" />
                                                <span>{notification.membershipType}</span>
                                            </div>
                                        )}
                                        
                                        {notification.targetType === 'specific' && (
                                            <div className="flex items-center text-xs text-gray-500">
                                                <FaUsers className="mr-1" />
                                                <span>{notification.targetUsers?.length || 0} recipients</span>
                                            </div>
                                        )}
                                        
                                        {notification.scheduledTime && (
                                            <div className="flex items-center text-xs text-gray-500">
                                                <FaCalendarAlt className="mr-1" />
                                                <span>
                                                    Scheduled: {new Date(notification.scheduledTime).toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className={`flex items-center text-xs ${
                                            notification.status === 'sent' 
                                                ? 'text-green-500' 
                                                : notification.status === 'scheduled'
                                                ? 'text-blue-500'
                                                : notification.status === 'failed'
                                                ? 'text-red-500'
                                                : 'text-gray-500'
                                        }`}>
                                            <span className="capitalize">{notification.status || 'sent'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <FaBell className="text-4xl mb-3 text-gray-300" />
                            <p>No notifications have been sent yet</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center mb-4 text-orange-500">
                            <FaExclamationTriangle size={24} className="mr-2" />
                            <h3 className="text-xl font-bold">Confirm Notification</h3>
                        </div>
                        <p className="mb-4">
                            Are you sure you want to send this notification to {' '}
                            <span className="font-semibold">
                                {notificationData.targetType === 'all' 
                                    ? 'all users' 
                                    : notificationData.targetType === 'specific'
                                    ? `${notificationData.targetUsers.length} selected users`
                                    : `users with ${notificationData.membershipType} membership`}
                            </span>?
                        </p>
                        <div className="bg-gray-100 p-3 rounded mb-4">
                            <p className="font-semibold">{notificationData.title}</p>
                            <p className="text-sm text-gray-700 mt-1">{notificationData.message}</p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={sendNotification}
                                disabled={loading}
                                className={`px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <FaPaperPlane className="mr-2" />
                                {loading ? 'Sending...' : 'Send Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PushNotifications;