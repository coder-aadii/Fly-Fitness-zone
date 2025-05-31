import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../components/dashboard/UserNavbar';
import { FaUser, FaLock, FaEnvelope, FaCamera, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { ENDPOINTS, getImageUrl } from '../config';

const UserSettings = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [emailData, setEmailData] = useState({
        newEmail: '',
        password: ''
    });
    const [emailError, setEmailError] = useState('');
    const [emailSuccess, setEmailSuccess] = useState('');
    const [verificationSent, setVerificationSent] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Check if token exists
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Fetch user data from backend
                const response = await fetch(ENDPOINTS.USER_PROFILE, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        // Unauthorized - token expired or invalid
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                setUser(userData);
                
                // Set profile image if exists
                if (userData.profileImage) {
                    // Use the helper function to get the full image URL
                    setImagePreview(getImageUrl(userData.profileImage));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Reset all status messages when changing tabs
        setPasswordError('');
        setPasswordSuccess('');
        setEmailError('');
        setEmailSuccess('');
        setVerificationSent(false);
        setUploadStatus(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!profileImage) {
            setUploadStatus({ type: 'error', message: 'Please select an image first' });
            return;
        }

        setUploadStatus({ type: 'loading', message: 'Uploading image...' });

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('profileImage', profileImage);

            // Important: Do NOT set Content-Type header when sending FormData
            // The browser will automatically set the correct Content-Type with boundary
            const response = await fetch(ENDPOINTS.PROFILE_IMAGE, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Do not set Content-Type here
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload image');
            }

            const data = await response.json();
            
            // Update the user state with the new profile image URL
            setUser(prev => ({ ...prev, profileImage: data.profileImage }));
            
            // Update the image preview with the full URL
            setImagePreview(getImageUrl(data.profileImage));
            
            setUploadStatus({ type: 'success', message: 'Profile image updated successfully' });
            
            // Reset the file input
            setProfileImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            console.error('Error uploading image:', err);
            setUploadStatus({ type: 'error', message: err.message });
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
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
        }
    };

    const handleEmailChange = (e) => {
        const { name, value } = e.target;
        setEmailData(prev => ({ ...prev, [name]: value }));
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setEmailError('');
        setEmailSuccess('');
        setVerificationSent(false);

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailData.newEmail)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(ENDPOINTS.CHANGE_EMAIL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    newEmail: emailData.newEmail,
                    password: emailData.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to request email change');
            }

            setEmailSuccess('Verification email sent to your new email address');
            setVerificationSent(true);
            // Don't clear the form in case they need to resend
        } catch (err) {
            setEmailError(err.message);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );

    if (error) return (
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

    return (
        <>
            <UserNavbar user={user} />
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h1>
                
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => handleTabChange('profile')}
                            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'profile'
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <FaUser className="inline mr-2" />
                            Profile Picture
                        </button>
                        <button
                            onClick={() => handleTabChange('password')}
                            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'password'
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <FaLock className="inline mr-2" />
                            Change Password
                        </button>
                        <button
                            onClick={() => handleTabChange('email')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'email'
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <FaEnvelope className="inline mr-2" />
                            Change Email
                        </button>
                    </nav>
                </div>

                {/* Profile Picture Tab */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Profile Picture</h2>
                        <div className="flex flex-col md:flex-row items-start md:items-center">
                            <div className="mb-4 md:mb-0 md:mr-8">
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-orange-300">
                                    {imagePreview ? (
                                        <img 
                                            src={imagePreview} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUser className="text-gray-400 text-5xl" />
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-600 mb-4">
                                    Upload a new profile picture. The image should be square and at least 200x200 pixels.
                                </p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center"
                                    >
                                        <FaCamera className="mr-2" />
                                        Select Image
                                    </button>
                                    <button
                                        onClick={handleImageUpload}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center"
                                        disabled={!profileImage}
                                    >
                                        <FaCheck className="mr-2" />
                                        Upload Image
                                    </button>
                                </div>
                                {uploadStatus && (
                                    <div className={`mt-4 p-3 rounded ${
                                        uploadStatus.type === 'error' 
                                            ? 'bg-red-100 text-red-700' 
                                            : uploadStatus.type === 'success'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {uploadStatus.type === 'loading' && (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-orange-500 mr-2"></div>
                                                {uploadStatus.message}
                                            </div>
                                        )}
                                        {uploadStatus.type !== 'loading' && uploadStatus.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Change Password Tab */}
                {activeTab === 'password' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Change Password</h2>
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
                                    className="bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Change Email Tab */}
                {activeTab === 'email' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Change Email Address</h2>
                        <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded">
                            <p className="text-sm">
                                <strong>Current Email:</strong> {user?.email || 'Not available'}
                            </p>
                            <p className="text-sm mt-2">
                                Changing your email requires verification. We'll send a confirmation link to your new email address.
                            </p>
                        </div>
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            {emailError && (
                                <div className="bg-red-100 text-red-700 p-3 rounded flex items-center">
                                    <FaExclamationTriangle className="mr-2" />
                                    {emailError}
                                </div>
                            )}
                            {emailSuccess && (
                                <div className="bg-green-100 text-green-700 p-3 rounded flex items-center">
                                    <FaCheck className="mr-2" />
                                    {emailSuccess}
                                </div>
                            )}
                            <div>
                                <label className="block font-medium mb-1 text-gray-700">New Email Address</label>
                                <input
                                    type="email"
                                    name="newEmail"
                                    value={emailData.newEmail}
                                    onChange={handleEmailChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1 text-gray-700">Current Password (for verification)</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={emailData.password}
                                    onChange={handleEmailChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2"
                                >
                                    {verificationSent ? 'Resend Verification Email' : 'Send Verification Email'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserSettings;