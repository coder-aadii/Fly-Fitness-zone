import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import UpdateProfileModal from '../components/dashboard/UpdateProfileModal';
import ProfileCard from '../components/dashboard/ProfileCard';
import FeesDueCard from '../components/dashboard/FeesDueCard';
import ProgressTracker from '../components/dashboard/ProgressTracker';
import Loader from '../components/Loader';
import { ENDPOINTS } from '../config';
import FeedLayout from '../feed/components/FeedLayout';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
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
                
                // Check localStorage for profile image if not in API response
                const localUserData = JSON.parse(localStorage.getItem('userData') || '{}');
                
                // Transform the data to match the expected format
                const formattedUser = {
                    name: userData.name || 'User',
                    // Include profileImage in the user object for the navbar
                    // Use profile image from API response or localStorage
                    profileImage: userData.profileImage || localUserData.profileImage || null,
                    profile: {
                        weight: userData.weight || 0,
                        height: userData.height || 0,
                        gender: userData.gender || 'Not specified',
                        dob: userData.dob || '',
                        purpose: userData.purpose || 'Not specified',
                        fitnessGoal: userData.fitnessGoal || 'Not specified',
                        shortTermGoal: userData.shortTermGoal || 'Not specified',
                        healthIssues: userData.healthIssues || 'None',
                        joiningDate: userData.joiningDate || new Date().toISOString(),
                        feesDueDate: userData.feesDueDate || '',
                        weightHistory: userData.weightHistory || []
                    }
                };

                setUser(formattedUser);
                
                // Update userData in localStorage with the latest profile image
                if (userData.profileImage) {
                    const localUserData = JSON.parse(localStorage.getItem('userData') || '{}');
                    localUserData.profileImage = userData.profileImage;
                    localStorage.setItem('userData', JSON.stringify(localUserData));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleUpdateClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSaveProfile = async (updatedProfile) => {
        try {
            const token = localStorage.getItem('token');
            
            // Send updated profile to backend
            const response = await fetch(ENDPOINTS.USER_PROFILE, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedProfile)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            // Update local state with new profile data
            setUser((prev) => ({
                ...prev,
                profile: { ...prev.profile, ...updatedProfile },
            }));
            
            setModalOpen(false);
        } catch (err) {
            alert('Error updating profile: ' + err.message);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <Loader size="large" />
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

    if (!user) return (
        <div className="text-center p-6">
            <p>No user data found. Please log in again.</p>
            <button 
                onClick={() => navigate('/login')} 
                className="mt-4 bg-orange-500 text-white px-4 py-2 rounded"
            >
                Go to Login
            </button>
        </div>
    );

    return (
        <FeedLayout>
            <WelcomeBanner userName={user.name} onUpdateClick={handleUpdateClick} />
            <UpdateProfileModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                profile={user.profile}
                onSave={handleSaveProfile}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <ProfileCard profile={user.profile} />
                <FeesDueCard feesDueDate={user.profile.feesDueDate} />
            </div>
            <div className="mt-6">
                <ProgressTracker
                    weightHistory={user.profile.weightHistory}
                    shortTermGoal={user.profile.shortTermGoal}
                />
            </div>
        </FeedLayout>
    );
};

export default UserDashboard;
