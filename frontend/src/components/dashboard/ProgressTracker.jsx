import React from 'react';

const ProgressTracker = ({ weightHistory = [], shortTermGoal }) => {
    // Helper to format date to dd/mm/yyyy
    const formatDate = (isoDate) => {
        const d = new Date(isoDate);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-orange-600">Your Progress</h3>

            <p><strong>Short Term Goal:</strong> {shortTermGoal || 'Not set'}</p>

            <div className="mt-4">
                <h4 className="font-semibold mb-2">Weight History</h4>
                {weightHistory.length === 0 ? (
                    <p>No weight records yet.</p>
                ) : (
                    <ul className="list-disc list-inside text-gray-700 max-h-48 overflow-auto">
                        {weightHistory.map(({ date, weight }, idx) => (
                            <li key={idx}>
                                {formatDate(date)}: {weight} kg
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ProgressTracker;
