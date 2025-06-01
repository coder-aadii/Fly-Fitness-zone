import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

const MotivationalMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState({
    message: '',
    type: 'morning',
    isActive: true
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all motivational messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/motivational-messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching motivational messages:', error);
      toast.error('Failed to load motivational messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMessage({
      ...newMessage,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Create a new message
  const handleCreateMessage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/motivational-messages`,
        newMessage,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Motivational message created successfully');
      setNewMessage({ message: '', type: 'morning', isActive: true });
      fetchMessages();
    } catch (error) {
      console.error('Error creating motivational message:', error);
      toast.error('Failed to create motivational message');
    }
  };

  // Start editing a message
  const handleEdit = (message) => {
    setEditingId(message._id);
    setNewMessage({
      message: message.message,
      type: message.type,
      isActive: message.isActive
    });
  };

  // Update a message
  const handleUpdateMessage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/motivational-messages/${editingId}`,
        newMessage,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Motivational message updated successfully');
      setEditingId(null);
      setNewMessage({ message: '', type: 'morning', isActive: true });
      fetchMessages();
    } catch (error) {
      console.error('Error updating motivational message:', error);
      toast.error('Failed to update motivational message');
    }
  };

  // Delete a message
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/motivational-messages/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.success('Motivational message deleted successfully');
        fetchMessages();
      } catch (error) {
        console.error('Error deleting motivational message:', error);
        toast.error('Failed to delete motivational message');
      }
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setNewMessage({ message: '', type: 'morning', isActive: true });
  };

  // Toggle message active status
  const toggleActive = async (message) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/motivational-messages/${message._id}`,
        { ...message, isActive: !message.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Message ${message.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchMessages();
    } catch (error) {
      console.error('Error toggling message status:', error);
      toast.error('Failed to update message status');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Motivational Messages</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Message' : 'Create New Message'}
        </h3>
        
        <form onSubmit={editingId ? handleUpdateMessage : handleCreateMessage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message Content
            </label>
            <textarea
              name="message"
              value={newMessage.message}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter motivational message content"
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Type
              </label>
              <select
                name="type"
                value={newMessage.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                name="isActive"
                checked={newMessage.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingId ? 'Update Message' : 'Create Message'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Message List</h3>
        
        <div className="mb-4 flex space-x-2">
          <button 
            onClick={() => fetchMessages()}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            All
          </button>
          <button 
            onClick={async () => {
              try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/motivational-messages?type=morning`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(response.data);
              } catch (error) {
                console.error('Error fetching morning messages:', error);
                toast.error('Failed to load morning messages');
              } finally {
                setLoading(false);
              }
            }}
            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Morning
          </button>
          <button 
            onClick={async () => {
              try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/motivational-messages?type=evening`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(response.data);
              } catch (error) {
                console.error('Error fetching evening messages:', error);
                toast.error('Failed to load evening messages');
              } finally {
                setLoading(false);
              }
            }}
            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Evening
          </button>
        </div>
        
        {loading ? (
          <p className="text-center py-4">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No motivational messages found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((message) => (
                  <tr key={message._id}>
                    <td className="px-6 py-4 whitespace-normal">
                      <div className="text-sm text-gray-900">{message.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        message.type === 'morning' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {message.type === 'morning' ? 'Morning' : 'Evening'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                          message.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                        onClick={() => toggleActive(message)}
                      >
                        {message.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(message)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(message._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">About Motivational Messages</h3>
        <p className="text-sm text-blue-700 mb-2">
          Motivational messages are sent to users twice daily:
        </p>
        <ul className="list-disc list-inside text-sm text-blue-700 ml-2 mb-2">
          <li>Morning messages at 8:00 AM</li>
          <li>Evening messages at 6:00 PM</li>
        </ul>
        <p className="text-sm text-blue-700">
          These messages encourage users to post about their fitness activities, increasing engagement with the app.
          If no custom messages are available, the system will use default messages.
        </p>
      </div>
    </div>
  );
};

export default MotivationalMessages;