import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaDumbbell, FaUserFriends, FaPlus, FaEdit, FaTrash, FaExclamationTriangle, FaMapMarkerAlt, FaSignal } from 'react-icons/fa';
import { ENDPOINTS } from '../../config';

const ClassSchedule = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [formData, setFormData] = useState({
        className: '',
        description: '',
        trainer: '',
        daysOfWeek: ['Monday'],
        startTime: '',
        endTime: '',
        capacity: 20,
        location: 'Main Studio',
        level: 'All Levels'
    });
    const [actionLoading, setActionLoading] = useState(false);
    const [trainers, setTrainers] = useState([]);
    const [filterDay, setFilterDay] = useState('all');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const locations = ['Main Studio', 'Yoga Room', 'Cardio Area', 'Outdoor Space', 'Pool Area'];

    useEffect(() => {
        fetchClasses();
        fetchTrainers();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(ENDPOINTS.ADMIN_CLASSES, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch classes');
            }

            const data = await response.json();
            setClasses(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching classes:', err);
            setError('Failed to load classes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchTrainers = async () => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(ENDPOINTS.ADMIN_TRAINERS, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch trainers');
            }

            const data = await response.json();
            setTrainers(data);
        } catch (err) {
            console.error('Error fetching trainers:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;
        
        if (name === 'dayOfWeek') {
            // Handle day of week checkbox
            const updatedDays = [...formData.daysOfWeek];
            if (checked) {
                // Add day if checked
                if (!updatedDays.includes(value)) {
                    updatedDays.push(value);
                }
            } else {
                // Remove day if unchecked
                const index = updatedDays.indexOf(value);
                if (index !== -1) {
                    updatedDays.splice(index, 1);
                }
            }
            setFormData({
                ...formData,
                daysOfWeek: updatedDays
            });
        } else {
            // Handle other inputs
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleAddClass = async (e) => {
        e.preventDefault();
        
        if (formData.daysOfWeek.length === 0) {
            setError('Please select at least one day of the week');
            return;
        }
        
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            // Format dates for API
            const startDateTime = new Date(`2023-01-01T${formData.startTime}`);
            const endDateTime = new Date(`2023-01-01T${formData.endTime}`);
            
            const classData = {
                className: formData.className,
                description: formData.description,
                trainer: formData.trainer,
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                daysOfWeek: formData.daysOfWeek,
                location: formData.location,
                capacity: parseInt(formData.capacity),
                level: formData.level
            };
            
            const response = await fetch(ENDPOINTS.ADMIN_CLASSES, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(classData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to add class');
            }

            const newClass = await response.json();
            
            // Update local state
            setClasses([...classes, newClass]);
            
            // Reset form and close modal
            setFormData({
                className: '',
                description: '',
                trainer: '',
                daysOfWeek: ['Monday'],
                startTime: '',
                endTime: '',
                capacity: 20,
                location: 'Main Studio',
                level: 'All Levels'
            });
            setShowAddModal(false);
        } catch (err) {
            console.error('Error adding class:', err);
            setError('Failed to add class. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditClass = async (e) => {
        e.preventDefault();
        
        if (!selectedClass) return;
        
        if (formData.daysOfWeek.length === 0) {
            setError('Please select at least one day of the week');
            return;
        }
        
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            // Format dates for API
            const startDateTime = new Date(`2023-01-01T${formData.startTime}`);
            const endDateTime = new Date(`2023-01-01T${formData.endTime}`);
            
            const classData = {
                className: formData.className,
                description: formData.description,
                trainer: formData.trainer,
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                daysOfWeek: formData.daysOfWeek,
                location: formData.location,
                capacity: parseInt(formData.capacity),
                level: formData.level
            };
            
            const response = await fetch(`${ENDPOINTS.ADMIN_CLASSES}/${selectedClass._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(classData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update class');
            }

            const updatedClass = await response.json();
            
            // Update local state
            setClasses(classes.map(cls => 
                cls._id === selectedClass._id ? updatedClass : cls
            ));
            
            // Reset form and close modal
            setSelectedClass(null);
            setShowEditModal(false);
        } catch (err) {
            console.error('Error updating class:', err);
            setError('Failed to update class. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteClass = async () => {
        if (!selectedClass) return;
        
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_CLASSES}/${selectedClass._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete class');
            }

            // Update local state
            setClasses(classes.filter(cls => cls._id !== selectedClass._id));
            
            // Reset and close modal
            setSelectedClass(null);
            setShowDeleteModal(false);
        } catch (err) {
            console.error('Error deleting class:', err);
            setError('Failed to delete class. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    // Format time for display
    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHour = hours % 12 || 12;
        return `${formattedHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    // Format time input value
    const formatTimeForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    // Filter classes by day
    const filteredClasses = filterDay === 'all' 
        ? classes 
        : classes.filter(cls => cls.daysOfWeek.includes(filterDay));

    // Sort classes by time
    const sortedClasses = [...filteredClasses].sort((a, b) => {
        return new Date(a.startTime) - new Date(b.startTime);
    });

    if (loading && classes.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Class Schedule</h2>
                <div className="flex items-center space-x-4">
                    <select
                        value={filterDay}
                        onChange={(e) => setFilterDay(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="all">All Days</option>
                        {days.map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                    >
                        <FaPlus className="mr-2" />
                        Add Class
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    <p>{error}</p>
                </div>
            )}

            {sortedClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedClasses.map(cls => (
                        <div key={cls._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4 text-white bg-orange-500">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">{cls.className}</h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedClass(cls);
                                                setFormData({
                                                    className: cls.className,
                                                    description: cls.description || '',
                                                    trainer: cls.trainer._id,
                                                    daysOfWeek: cls.daysOfWeek,
                                                    startTime: formatTimeForInput(cls.startTime),
                                                    endTime: formatTimeForInput(cls.endTime),
                                                    capacity: cls.capacity,
                                                    location: cls.location,
                                                    level: cls.level
                                                });
                                                setShowEditModal(true);
                                            }}
                                            className="text-white hover:text-gray-200"
                                            title="Edit Class"
                                        >
                                            <FaEdit size={18} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedClass(cls);
                                                setShowDeleteModal(true);
                                            }}
                                            className="text-white hover:text-gray-200"
                                            title="Delete Class"
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {cls.daysOfWeek.map(day => (
                                        <span 
                                            key={day} 
                                            className={`text-xs px-2 py-1 rounded-full ${
                                                day === 'Monday' ? 'bg-blue-600' :
                                                day === 'Tuesday' ? 'bg-purple-600' :
                                                day === 'Wednesday' ? 'bg-green-600' :
                                                day === 'Thursday' ? 'bg-yellow-600' :
                                                day === 'Friday' ? 'bg-pink-600' :
                                                day === 'Saturday' ? 'bg-indigo-600' :
                                                'bg-red-600'
                                            }`}
                                        >
                                            {day}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center text-gray-700 mb-2">
                                    <FaClock className="mr-2 text-orange-500" />
                                    <span>{formatTime(cls.startTime)} - {formatTime(cls.endTime)}</span>
                                </div>
                                <div className="flex items-center text-gray-700 mb-2">
                                    <FaDumbbell className="mr-2 text-orange-500" />
                                    <span>{cls.trainer && typeof cls.trainer === 'object' ? cls.trainer.name : 'Unknown Trainer'}</span>
                                </div>
                                <div className="flex items-center text-gray-700 mb-2">
                                    <FaUserFriends className="mr-2 text-orange-500" />
                                    <span>Capacity: {cls.capacity} people</span>
                                </div>
                                <div className="flex items-center text-gray-700 mb-3">
                                    <FaSignal className="mr-2 text-orange-500" />
                                    <span>Level: {cls.level}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{cls.description}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <FaMapMarkerAlt className="mr-1 text-orange-500" />
                                    {cls.location}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500">
                        {filterDay === 'all' 
                            ? 'No classes have been scheduled yet.' 
                            : `No classes scheduled for ${filterDay}.`}
                    </p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center"
                    >
                        <FaPlus className="mr-2" />
                        Add Your First Class
                    </button>
                </div>
            )}

            {/* Add Class Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Class</h3>
                        
                        <form onSubmit={handleAddClass}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="className">
                                    Class Name
                                </label>
                                <input
                                    type="text"
                                    id="className"
                                    name="className"
                                    value={formData.className}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter class name"
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter class description"
                                    rows="3"
                                ></textarea>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="trainer">
                                    Trainer
                                </label>
                                <select
                                    id="trainer"
                                    name="trainer"
                                    value={formData.trainer}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    <option value="">Select a trainer</option>
                                    {trainers.map(trainer => (
                                        <option key={trainer._id} value={trainer._id}>{trainer.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Days of Week
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {days.map(day => (
                                        <label key={day} className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                name="dayOfWeek"
                                                value={day}
                                                checked={formData.daysOfWeek.includes(day)}
                                                onChange={handleInputChange}
                                                className="form-checkbox h-5 w-5 text-orange-500"
                                            />
                                            <span className="ml-2 text-gray-700">{day}</span>
                                        </label>
                                    ))}
                                </div>
                                {formData.daysOfWeek.length === 0 && (
                                    <p className="text-red-500 text-xs mt-1">Please select at least one day</p>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        id="startTime"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        id="endTime"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
                                        Maximum Capacity
                                    </label>
                                    <input
                                        type="number"
                                        id="capacity"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">
                                        Level
                                    </label>
                                    <select
                                        id="level"
                                        name="level"
                                        value={formData.level}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    >
                                        <option value="All Levels">All Levels</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                                    Location
                                </label>
                                <select
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    {locations.map(location => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading || formData.daysOfWeek.length === 0}
                                    className={`px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 ${
                                        (actionLoading || formData.daysOfWeek.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {actionLoading ? 'Adding...' : 'Add Class'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Class Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Class</h3>
                        
                        <form onSubmit={handleEditClass}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-className">
                                    Class Name
                                </label>
                                <input
                                    type="text"
                                    id="edit-className"
                                    name="className"
                                    value={formData.className}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter class name"
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-description">
                                    Description
                                </label>
                                <textarea
                                    id="edit-description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter class description"
                                    rows="3"
                                ></textarea>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-trainer">
                                    Trainer
                                </label>
                                <select
                                    id="edit-trainer"
                                    name="trainer"
                                    value={formData.trainer}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    <option value="">Select a trainer</option>
                                    {trainers.map(trainer => (
                                        <option key={trainer._id} value={trainer._id}>{trainer.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Days of Week
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {days.map(day => (
                                        <label key={day} className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                name="dayOfWeek"
                                                value={day}
                                                checked={formData.daysOfWeek.includes(day)}
                                                onChange={handleInputChange}
                                                className="form-checkbox h-5 w-5 text-orange-500"
                                            />
                                            <span className="ml-2 text-gray-700">{day}</span>
                                        </label>
                                    ))}
                                </div>
                                {formData.daysOfWeek.length === 0 && (
                                    <p className="text-red-500 text-xs mt-1">Please select at least one day</p>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-startTime">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        id="edit-startTime"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-endTime">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        id="edit-endTime"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-capacity">
                                        Maximum Capacity
                                    </label>
                                    <input
                                        type="number"
                                        id="edit-capacity"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-level">
                                        Level
                                    </label>
                                    <select
                                        id="edit-level"
                                        name="level"
                                        value={formData.level}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    >
                                        <option value="All Levels">All Levels</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-location">
                                    Location
                                </label>
                                <select
                                    id="edit-location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    {locations.map(location => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedClass(null);
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading || formData.daysOfWeek.length === 0}
                                    className={`px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 ${
                                        (actionLoading || formData.daysOfWeek.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {actionLoading ? 'Updating...' : 'Update Class'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Class Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center mb-4 text-red-600">
                            <FaExclamationTriangle size={24} className="mr-2" />
                            <h3 className="text-xl font-bold">Delete Class</h3>
                        </div>
                        <p className="mb-4">
                            Are you sure you want to delete <span className="font-semibold">{selectedClass?.className}</span> from the schedule?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedClass(null);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteClass}
                                disabled={actionLoading}
                                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${
                                    actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {actionLoading ? 'Deleting...' : 'Delete Class'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassSchedule;