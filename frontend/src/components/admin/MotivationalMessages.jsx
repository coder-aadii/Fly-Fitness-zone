import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaBell, FaSun, FaMoon } from 'react-icons/fa';
import { ENDPOINTS } from '../../config';

const MotivationalMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const [messageData, setMessageData] = useState({
        message: '',
        type: 'morning'
    });
    
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    useEffect(() => {
        fetchMessages();
    }, []);
    
    const fetchMessages = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(ENDPOINTS.MOTIVATIONAL_MESSAGES, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch motivational messages');
            }
            
            const data = await response.json();
            setMessages(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching motivational messages:', err);
            setError('Failed to load motivational messages. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMessageData({
            ...messageData,
            [name]: value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const url = editingId 
                ? `${ENDPOINTS.MOTIVATIONAL_MESSAGES}/${editingId}`
                : ENDPOINTS.MOTIVATIONAL_MESSAGES;
                
            const method = editingId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(messageData)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to ${editingId ? 'update' : 'create'} motivational message`);
            }
            
            // Reset form and refresh messages
            setMessageData({
                message: '',
                type: 'morning'
            });
            setEditingId(null);
            setShowForm(false);
            setSuccess(`Motivational message ${editingId ? 'updated' : 'created'} successfully!`);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
            
            // Refresh messages list
            fetchMessages();
        } catch (err) {
            console.error(`Error ${editingId ? 'updating' : 'creating'} motivational message:`, err);
            setError(`Failed to ${editingId ? 'update' : 'create'} motivational message. Please try again.`);
        } finally {
            setLoading(false);
        }
    };
    
    const handleEdit = (message) => {
        setMessageData({
            message: message.message,
            type: message.type
        });
        setEditingId(message._id);
        setShowForm(true);
    };
    
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this motivational message?')) {
            return;
        }
        
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.MOTIVATIONAL_MESSAGES}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete motivational message');
            }
            
            setSuccess('Motivational message deleted successfully!');
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
            
            // Refresh messages list
            fetchMessages();
        } catch (err) {
            console.error('Error deleting motivational message:', err);
            setError('Failed to delete motivational message. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleToggleStatus = async (id, currentStatus) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.MOTIVATIONAL_MESSAGES}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update message status');
            }
            
            setSuccess(`Message ${currentStatus ? 'disabled' : 'enabled'} successfully!`);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
            
            // Refresh messages list
            fetchMessages();
        } catch (err) {
            console.error('Error updating message status:', err);
            setError('Failed to update message status. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const cancelEdit = () => {
        setMessageData({
            message: '',
            type: 'morning'
        });
        setEditingId(null);
        setShowForm(false);
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Motivational Messages</h2>
            
            <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                    Manage motivational messages sent to users in the morning and evening to encourage fitness activity posts.
                </p>
                
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center"
                >
                    <FaPlus className="mr-2" />
                    {showForm ? 'Cancel' : 'Add New Message'}
                </button>
            </div>
            
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                    {success}
                </div>
            )}
            
            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingId ? 'Edit Motivational Message' : 'Add New Motivational Message'}
                    </h3>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Message Type
                            </label>
                            <div className="flex space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="morning"
                                        checked={messageData.type === 'morning'}
                                        onChange={handleInputChange}
                                        className="form-radio h-4 w-4 text-orange-500"
                                    />
                                    <span className="ml-2 flex items-center">
                                        <FaSun className="text-yellow-500 mr-1" /> Morning
                                    </span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="evening"
                                        checked={messageData.type === 'evening'}
                                        onChange={handleInputChange}
                                        className="form-radio h-4 w-4 text-orange-500"
                                    />
                                    <span className="ml-2 flex items-center">
                                        <FaMoon className="text-blue-500 mr-1" /> Evening
                                    </span>
                                </label>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Message Content
                            </label>
                            <textarea
                                name="message"
                                value={messageData.message}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="3"
                                placeholder="Enter motivational message"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Use emojis to make your message more engaging! 💪 🏋️‍♀️ 🏃‍♂️ 🧘‍♀️
                            </p>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                                        Saving...
                                    </span>
                                ) : (
                                    <>
                                        <FaCheck className="mr-2" />
                                        {editingId ? 'Update Message' : 'Save Message'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold flex items-center">
                        <FaBell className="text-orange-500 mr-2" />
                        Motivational Messages
                    </h3>
                </div>
                
                {loading && messages.length === 0 ? (
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="text-gray-500">No motivational messages found. Add your first message!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {messages.map(message => (
                            <div key={message._id} className="p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-1">
                                            {message.type === 'morning' ? (
                                                <FaSun className="text-yellow-500 mr-2" />
                                            ) : (
                                                <FaMoon className="text-blue-500 mr-2" />
                                            )}
                                            <span className="font-medium capitalize">
                                                {message.type} Message
                                            </span>
                                            {message.isActive ? (
                                                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-700">{message.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Created: {new Date(message.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleToggleStatus(message._id, message.isActive)}
                                            className={`p-2 rounded ${
                                                message.isActive 
                                                    ? 'text-red-500 hover:bg-red-100' 
                                                    : 'text-green-500 hover:bg-green-100'
                                            }`}
                                            title={message.isActive ? 'Disable message' : 'Enable message'}
                                        >
                                            {message.isActive ? <FaTimes /> : <FaCheck />}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(message)}
                                            className="p-2 text-blue-500 hover:bg-blue-100 rounded"
                                            title="Edit message"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(message._id)}
                                            className="p-2 text-red-500 hover:bg-red-100 rounded"
                                            title="Delete message"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MotivationalMessages;