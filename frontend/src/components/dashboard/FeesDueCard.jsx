import React from 'react';

const FeesDueCard = ({ feesDueDate }) => {
    const today = new Date();
    const dueDate = feesDueDate ? new Date(feesDueDate) : null;
    const isOverdue = dueDate && dueDate < today;

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className={`p-6 rounded-lg shadow-md ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            <h3 className="text-xl font-semibold mb-4 text-orange-600">Fees Due Date</h3>
            {dueDate ? (
                <p>
                    Your fees are due on <strong>{formatDate(dueDate)}</strong>.
                    {isOverdue ? ' Please pay immediately.' : ' Please ensure payment before due date.'}
                </p>
            ) : (
                <p>No fees due date set.</p>
            )}
        </div>
    );
};

export default FeesDueCard;
