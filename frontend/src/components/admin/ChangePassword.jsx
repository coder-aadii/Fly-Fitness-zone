import React, { useState } from 'react';
import { FaLock, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { ENDPOINTS } from '../../config';

const ChangePassword = () => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        setPasswordLoading(true);

        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            setPasswordLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            setPasswordLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(ENDPOINTS.CHANGE_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change password');
            }

            setPasswordSuccess('Password changed successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setPasswordError(err.message);
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
                <div className="flex items-center mb-6">
                    <div className="rounded-full bg-orange-100 p-3 mr-4">
                        <FaLock className="text-orange-600 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Update Your Password</h3>
                        <p className="text-gray-600">Ensure your account is secure by using a strong password</p>
                    </div>
                </div>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    {passwordError && (
                        <div className="bg-red-100 text-red-700 p-3 rounded flex items-center">
                            <FaExclamationTriangle className="mr-2" />
                            {passwordError}
                        </div>
                    )}
                    {passwordSuccess && (
                        <div className="bg-green-100 text-green-700 p-3 rounded flex items-center">
                            <FaCheck className="mr-2" />
                            {passwordSuccess}
                        </div>
                    )}
                    <div>
                        <label className="block font-medium mb-1 text-gray-700">Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1 text-gray-700">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                            minLength={6}
                        />
                        <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                    </div>
                    <div>
                        <label className="block font-medium mb-1 text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2 flex items-center"
                            disabled={passwordLoading}
                        >
                            {passwordLoading ? (
                                <>
                                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <FaLock className="mr-2" />
                                    Update Password
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;