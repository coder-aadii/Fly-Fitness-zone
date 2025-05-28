import React, { useState, useEffect } from 'react';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import UpdateProfileModal from '../components/dashboard/UpdateProfileModal';
import ProfileCard from '../components/dashboard/ProfileCard';
import FeesDueCard from '../components/dashboard/FeesDueCard';
import ProgressTracker from '../components/dashboard/ProgressTracker';

// Simulate fetch user data from API or context
const mockUser = {
    name: 'Aditya',
    profile: {
        weight: 82,
        height: 175,
        gender: 'Male',
        purpose: 'Weight Loss',
        fitnessGoal: 'Run 5k without stopping',
        shortTermGoal: 'Lose 3 kg in 2 months',
        joiningDate: '2024-01-15T00:00:00Z',
        feesDueDate: '2024-06-01T00:00:00Z',
        weightHistory: [
            { date: '2024-01-01T00:00:00Z', weight: 75 },
            { date: '2024-02-01T00:00:00Z', weight: 74 },
            { date: '2024-03-01T00:00:00Z', weight: 73 },
            { date: '2024-04-01T00:00:00Z', weight: 72 },
        ],
    },
};

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // In real app, fetch user data here
        setUser(mockUser);
    }, []);

    const handleUpdateClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSaveProfile = (updatedProfile) => {
        // Save updated profile logic here (API call)
        setUser((prev) => ({
            ...prev,
            profile: { ...prev.profile, ...updatedProfile },
        }));
        setModalOpen(false);
    };

    if (!user) return <p>Loading...</p>;

    return (
        <>
            
            <div className="max-w-5xl mx-auto p-6">
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
            </div>
        </>
    );
};

export default UserDashboard;
