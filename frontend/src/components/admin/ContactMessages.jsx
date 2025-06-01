import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaCheck, FaTrash, FaReply, FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import { ENDPOINTS } from '../../config';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'unresolved', 'resolved'

    useEffect(() => {
        fetchMessages();
    }, [filterStatus]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            let url = ENDPOINTS.ADMIN_CONTACT_MESSAGES;
            if (filterStatus !== 'all') {
                url += `?status=${filterStatus}`;
            }
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch contact messages');
            }

            const data = await response.json();
            setMessages(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching contact messages:', err);
            setError('Failed to load contact messages. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsResolved = async (message) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_CONTACT_MESSAGES}/${message._id}/resolve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update message status');
            }

            // Update local state
            setMessages(messages.map(msg => 
                msg._id === message._id 
                    ? { ...msg, status: 'resolved' } 
                    : msg
            ));
        } catch (err) {
            console.error('Error updating message status:', err);
            setError('Failed to update message status. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReplySubmit = async () => {
        if (!selectedMessage || !replyText.trim()) return;
        
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_CONTACT_MESSAGES}/${selectedMessage._id}/reply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ replyText })
            });

            if (!response.ok) {
                throw new Error('Failed to send reply');
            }

            await response.json(); // We acknowledge the response but don't need to use it
            
            // Update local state
            setMessages(messages.map(msg => 
                msg._id === selectedMessage._id 
                    ? { ...msg, status: 'resolved', reply: replyText, repliedAt: new Date() } 
                    : msg
            ));
            
            // Close modal and reset
            setShowReplyModal(false);
            setReplyText('');
            setSelectedMessage(null);
        } catch (err) {
            console.error('Error sending reply:', err);
            setError('Failed to send reply. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteMessage = async () => {
        if (!selectedMessage) return;
        
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_CONTACT_MESSAGES}/${selectedMessage._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete message');
            }

            // Update local state
            setMessages(messages.filter(msg => msg._id !== selectedMessage._id));
            
            // Close modal and reset
            setShowDeleteModal(false);
            setSelectedMessage(null);
        } catch (err) {
            console.error('Error deleting message:', err);
            setError('Failed to delete message. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    // Format the message time
    const formatMessageTime = (createdAt) => {
        const messageDate = new Date(createdAt);
        return messageDate.toLocaleString();
    };

    // Filter messages based on search term
    const filteredMessages = messages.filter(message => 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && messages.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Contact Messages</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="all">All Messages</option>
                        <option value="unresolved">Unresolved</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {filteredMessages.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredMessages.map(message => (
                                    <tr key={message._id} className={message.status === 'unresolved' ? 'bg-orange-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{message.name}</div>
                                            <div className="text-sm text-gray-500">{message.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">{message.subject}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{message.message}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatMessageTime(message.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${message.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {message.status === 'resolved' ? 'Resolved' : 'Unresolved'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedMessage(message);
                                                        setShowReplyModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Reply"
                                                >
                                                    <FaReply size={18} />
                                                </button>
                                                
                                                {message.status === 'unresolved' && (
                                                    <button
                                                        onClick={() => handleMarkAsResolved(message)}
                                                        disabled={actionLoading}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Mark as Resolved"
                                                    >
                                                        <FaCheck size={18} />
                                                    </button>
                                                )}
                                                
                                                <button
                                                    onClick={() => {
                                                        setSelectedMessage(message);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <FaTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                        <FaEnvelope className="text-4xl text-gray-300 mb-3" />
                        <p className="text-gray-500">
                            {searchTerm ? 'No messages match your search.' : 'No contact messages found.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Reply Modal */}
            {showReplyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Reply to Message</h3>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">From: {selectedMessage.name}</span>
                                <span className="text-xs text-gray-500">{formatMessageTime(selectedMessage.createdAt)}</span>
                            </div>
                            <div className="text-sm text-gray-700 mb-2">Email: {selectedMessage.email}</div>
                            <div className="text-sm font-semibold text-gray-700 mb-1">Subject: {selectedMessage.subject}</div>
                            <p className="text-sm text-gray-700">{selectedMessage.message}</p>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Your Reply</label>
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                rows="5"
                                placeholder="Type your reply here..."
                                required
                            ></textarea>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowReplyModal(false);
                                    setSelectedMessage(null);
                                    setReplyText('');
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReplySubmit}
                                disabled={!replyText.trim() || actionLoading}
                                className={`px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center ${
                                    !replyText.trim() || actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <FaReply className="mr-2" />
                                {actionLoading ? 'Sending...' : 'Send Reply'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center mb-4 text-red-600">
                            <FaExclamationTriangle size={24} className="mr-2" />
                            <h3 className="text-xl font-bold">Delete Message</h3>
                        </div>
                        <p className="mb-4">
                            Are you sure you want to permanently delete this message from <span className="font-semibold">{selectedMessage?.name}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedMessage(null);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteMessage}
                                disabled={actionLoading}
                                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${
                                    actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {actionLoading ? 'Processing...' : 'Delete Message'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactMessages;