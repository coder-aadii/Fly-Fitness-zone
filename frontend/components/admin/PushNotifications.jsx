import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

const PushNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    targetAudience: 'All Users',
    clickAction: '/feed'
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all push notifications
  const fetchNotifications = async (pageNum = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${ENDPOINTS.ADMIN_NOTIFICATIONS}?page=${pageNum}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(response.data.notifications);
      setTotalPages(response.data.totalPages);
      setPage(response.data.currentPage);
    } catch (error) {
      console.error('Error fetching push notifications:', error);
      toast.error('Failed to load push notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotification({
      ...newNotification,
      [name]: value
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreviewUrl('');
    }
  };

  // Send a new push notification
  const handleSendNotification = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('title', newNotification.title);
      formData.append('message', newNotification.message);
      formData.append('targetAudience', newNotification.targetAudience);
      formData.append('clickAction', newNotification.clickAction);
      
      if (file) {
        formData.append('image', file);
      }
      
      await axios.post(
        `${API_URL}/api/push-notifications`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      toast.success('Push notification sent successfully');
      setNewNotification({
        title: '',
        message: '',
        targetAudience: 'All Users',
        clickAction: '/feed'
      });
      setFile(null);
      setPreviewUrl('');
      fetchNotifications();
    } catch (error) {
      console.error('Error sending push notification:', error);
      toast.error('Failed to send push notification');
    }
  };

  // Delete a notification
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/push-notifications/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.success('Push notification deleted successfully');
        fetchNotifications(page);
      } catch (error) {
        console.error('Error deleting push notification:', error);
        toast.error('Failed to delete push notification');
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Push Notifications</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Send New Notification</h3>
        
        <form onSubmit={handleSendNotification} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={newNotification.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notification title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={newNotification.message}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Notification message"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience
              </label>
              <select
                name="targetAudience"
                value={newNotification.targetAudience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Users">All Users</option>
                <option value="Active Users">Active Users</option>
                <option value="Inactive Users">Inactive Users</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Click Action (URL)
              </label>
              <input
                type="text"
                name="clickAction"
                value={newNotification.clickAction}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/feed"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {previewUrl && (
              <div className="mt-2">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="h-32 object-contain border rounded-md"
                />
              </div>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send Notification
            </button>
          </div>
        </form>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Notification History</h3>
        
        {loading ? (
          <p className="text-center py-4">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No push notifications found</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title/Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <tr key={notification._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          {notification.imageUrl && (
                            <img 
                              src={notification.imageUrl} 
                              alt="Notification" 
                              className="h-12 w-12 object-cover rounded-md mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                            <div className="text-sm text-gray-500">{notification.message}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(notification.sentAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {notification.targetAudience}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-500">
                          <div>Sent: {notification.deliveryStats.sent}</div>
                          <div>Delivered: {notification.deliveryStats.delivered}</div>
                          <div>Clicked: {notification.deliveryStats.clicked}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(notification._id)}
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => fetchNotifications(page > 1 ? page - 1 : 1)}
                    disabled={page === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages).keys()].map((num) => (
                    <button
                      key={num + 1}
                      onClick={() => fetchNotifications(num + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        page === num + 1 ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {num + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => fetchNotifications(page < totalPages ? page + 1 : totalPages)}
                    disabled={page === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      page === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">About Automated Notifications</h3>
        <p className="text-sm text-blue-700 mb-2">
          In addition to manual push notifications, the system automatically sends motivational notifications twice daily:
        </p>
        <ul className="list-disc list-inside text-sm text-blue-700 ml-2 mb-2">
          <li>Morning notifications at 8:00 AM - encouraging users to share their workout plans</li>
          <li>Evening notifications at 6:00 PM - prompting users to share their fitness achievements</li>
        </ul>
        <p className="text-sm text-blue-700">
          These automated notifications help increase user engagement and encourage regular posting about fitness activities.
          You can customize the content of these automated messages in the Motivational Messages section.
        </p>
      </div>
    </div>
  );
};

export default PushNotifications;