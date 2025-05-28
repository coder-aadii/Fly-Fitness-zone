import React, { useState } from 'react';

const UpdateProfileModal = ({ isOpen, onClose, profile, onSave }) => {
    const [formData, setFormData] = useState({ ...profile });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-lg overflow-auto max-h-[90vh]">
                <h3 className="text-xl font-semibold mb-4">Update Your Profile</h3>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block font-medium mb-1">Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight || ''}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Height (cm)</label>
                        <input
                            type="number"
                            name="height"
                            value={formData.height || ''}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender || ''}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob || ''}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Purpose to Join FFZ</label>
                        <input
                            type="text"
                            name="purpose"
                            value={formData.purpose || ''}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            placeholder="e.g. Weight Loss, Muscle Gain"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Fitness Goal</label>
                        <input
                            type="text"
                            name="fitnessGoal"
                            value={formData.fitnessGoal || ''}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            placeholder="e.g. Run 5k, Increase stamina"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Short Term Goal</label>
                        <input
                            type="text"
                            name="shortTermGoal"
                            value={formData.shortTermGoal || ''}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            placeholder="e.g. Lose 3 kg in 2 months"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Health Issues (if any)</label>
                        <textarea
                            name="healthIssues"
                            value={formData.healthIssues || ''}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            placeholder="e.g. Back pain, Asthma"
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 rounded px-4 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfileModal;
