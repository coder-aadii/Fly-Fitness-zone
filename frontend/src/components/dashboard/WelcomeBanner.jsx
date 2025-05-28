import React from 'react';

const WelcomeBanner = ({ userName, onUpdateClick }) => {
    return (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-6 py-4 rounded-md shadow-md flex justify-between items-center">
            <h2 className="text-xl font-semibold">
                Welcome back, <span className="text-orange-600">{userName}</span>!
            </h2>
            <button
                onClick={onUpdateClick}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition"
            >
                Update Profile
            </button>
        </div>
    );
};

export default WelcomeBanner;
