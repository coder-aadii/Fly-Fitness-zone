import React from 'react';

const ProfileCard = ({ profile }) => {
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-orange-600">Your Fitness Profile</h3>
            <ul className="space-y-2 text-gray-700">
                <li><strong>Weight:</strong> {profile.weight || 'N/A'} kg</li>
                <li><strong>Height:</strong> {profile.height || 'N/A'} cm</li>
                <li><strong>Gender:</strong> {profile.gender || 'N/A'}</li>
                <li><strong>Date of Birth:</strong> {profile.dob ? formatDate(profile.dob) : 'N/A'}</li>
                <li><strong>Purpose to Join FFZ:</strong> {profile.purpose || 'N/A'}</li>
                <li><strong>Fitness Goal:</strong> {profile.fitnessGoal || 'N/A'}</li>
                <li><strong>Short Term Goal:</strong> {profile.shortTermGoal || 'N/A'}</li>
                <li><strong>Health Issues:</strong> {profile.healthIssues || 'None'}</li>
                <li><strong>FFZ Joining Date:</strong> {profile.joiningDate ? formatDate(profile.joiningDate) : 'N/A'}</li>
            </ul>
        </div>
    );
};

export default ProfileCard;
