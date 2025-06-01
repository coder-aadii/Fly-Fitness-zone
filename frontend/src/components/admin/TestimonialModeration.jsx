import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaCheck, FaTimes, FaTrash, FaExclamationTriangle, FaSearch } from 'react-icons/fa';
// Note: FaFilter was imported but not used. If you plan to add filtering functionality later,
// you can uncomment the import below:
// import { FaFilter } from 'react-icons/fa';
import { ENDPOINTS, getImageUrl } from '../../config';

const TestimonialModeration = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

    useEffect(() => {
        fetchTestimonials();
    }, [filterStatus]); // eslint-disable-line react-hooks/exhaustive-deps
    // Note: We're intentionally not including fetchTestimonials in the dependency array
    // to prevent unnecessary re-fetching. The function only needs to be called when filterStatus changes.

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            let url = ENDPOINTS.ADMIN_TESTIMONIALS;
            if (filterStatus !== 'all') {
                url += `?status=${filterStatus}`;
            }
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch testimonials');
            }

            const data = await response.json();
            console.log('Testimonials API response:', data);
            
            // Ensure data is an array
            if (Array.isArray(data)) {
                setTestimonials(data);
            } else if (data && typeof data === 'object' && data.testimonials && Array.isArray(data.testimonials)) {
                // Handle case where testimonials are nested in an object
                setTestimonials(data.testimonials);
            } else {
                console.error('API returned non-array data:', data);
                setTestimonials([]);
                setError('Received invalid data format from server. Check console for details.');
            }
        } catch (err) {
            console.error('Error fetching testimonials:', err);
            setError('Failed to load testimonials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveTestimonial = async (testimonial) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_TESTIMONIALS}/${testimonial._id}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to approve testimonial');
            }

            // Update local state
            if (Array.isArray(testimonials)) {
                setTestimonials(testimonials.map(t => 
                    t._id === testimonial._id 
                        ? { ...t, status: 'approved' } 
                        : t
                ));
            }
        } catch (err) {
            console.error('Error approving testimonial:', err);
            setError('Failed to approve testimonial. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectTestimonial = async (testimonial) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_TESTIMONIALS}/${testimonial._id}/reject`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to reject testimonial');
            }

            // Update local state
            if (Array.isArray(testimonials)) {
                setTestimonials(testimonials.map(t => 
                    t._id === testimonial._id 
                        ? { ...t, status: 'rejected' } 
                        : t
                ));
            }
        } catch (err) {
            console.error('Error rejecting testimonial:', err);
            setError('Failed to reject testimonial. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleFeatured = async (testimonial) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_TESTIMONIALS}/${testimonial._id}/feature`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update testimonial');
            }

            const data = await response.json();
            
            // Update local state
            if (Array.isArray(testimonials)) {
                setTestimonials(testimonials.map(t => 
                    t._id === testimonial._id 
                        ? { ...t, featured: data.featured } 
                        : t
                ));
            }
        } catch (err) {
            console.error('Error updating testimonial:', err);
            setError('Failed to update testimonial. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteTestimonial = async () => {
        if (!selectedTestimonial) return;
        
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_TESTIMONIALS}/${selectedTestimonial._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete testimonial');
            }

            // Update local state
            if (Array.isArray(testimonials)) {
                setTestimonials(testimonials.filter(t => t._id !== selectedTestimonial._id));
            }
            
            // Close modal and reset
            setShowDeleteModal(false);
            setSelectedTestimonial(null);
        } catch (err) {
            console.error('Error deleting testimonial:', err);
            setError('Failed to delete testimonial. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    // Format the testimonial date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Render stars for rating
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FaStar 
                    key={i} 
                    className={i <= rating ? 'text-yellow-500' : 'text-gray-300'} 
                />
            );
        }
        return <div className="flex space-x-1">{stars}</div>;
    };

    // Filter testimonials based on search term
    const filteredTestimonials = Array.isArray(testimonials) ? testimonials.filter(testimonial => {
        return (
            (testimonial && testimonial.user && testimonial.user.name && 
             typeof testimonial.user.name === 'string' && 
             testimonial.user.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (testimonial && testimonial.text && 
             typeof testimonial.text === 'string' && 
             testimonial.text.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }) : [];

    if (loading && testimonials.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Testimonial Moderation</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search testimonials..."
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
                        <option value="all">All Testimonials</option>
                        <option value="pending">Pending Approval</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    <p>{error}</p>
                </div>
            )}

            {filteredTestimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTestimonials.map(testimonial => (
                        <div 
                            key={testimonial._id} 
                            className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                                testimonial.status === 'pending' ? 'border-yellow-500' :
                                testimonial.status === 'approved' ? 'border-green-500' :
                                'border-red-500'
                            }`}
                        >
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                                            {testimonial.user?.profileImage ? (
                                                <img 
                                                    src={getImageUrl(testimonial.user.profileImage)} 
                                                    alt={testimonial.user.name} 
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-orange-200 flex items-center justify-center">
                                                    <span className="text-orange-500 font-semibold">
                                                        {testimonial.user?.name?.charAt(0) || 'U'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{testimonial.user?.name}</h3>
                                            <p className="text-xs text-gray-500">{formatDate(testimonial.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        {testimonial.status === 'approved' && (
                                            <button
                                                onClick={() => handleToggleFeatured(testimonial)}
                                                disabled={actionLoading}
                                                className={`text-yellow-500 hover:text-yellow-700 ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                title={testimonial.featured ? "Unmark as featured" : "Mark as featured"}
                                            >
                                                {testimonial.featured ? <FaStar size={18} /> : <FaRegStar size={18} />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    {renderStars(testimonial.rating)}
                                </div>
                                
                                <p className="text-gray-700 mb-4">{testimonial.text}</p>
                                
                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-gray-500">
                                        Status: <span className={`font-semibold ${
                                            testimonial.status === 'pending' ? 'text-yellow-600' :
                                            testimonial.status === 'approved' ? 'text-green-600' :
                                            'text-red-600'
                                        }`}>
                                            {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        {testimonial.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleApproveTestimonial(testimonial)}
                                                    disabled={actionLoading}
                                                    className={`p-1 rounded bg-green-100 text-green-600 hover:bg-green-200 ${
                                                        actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                    title="Approve"
                                                >
                                                    <FaCheck size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleRejectTestimonial(testimonial)}
                                                    disabled={actionLoading}
                                                    className={`p-1 rounded bg-red-100 text-red-600 hover:bg-red-200 ${
                                                        actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                    title="Reject"
                                                >
                                                    <FaTimes size={16} />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => {
                                                setSelectedTestimonial(testimonial);
                                                setShowDeleteModal(true);
                                            }}
                                            className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            title="Delete"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <FaStar className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500">
                        {searchTerm 
                            ? 'No testimonials match your search.' 
                            : filterStatus !== 'all'
                                ? `No ${filterStatus} testimonials found.`
                                : 'No testimonials have been submitted yet.'}
                    </p>
                </div>
            )}

            {/* Delete Testimonial Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center mb-4 text-red-600">
                            <FaExclamationTriangle size={24} className="mr-2" />
                            <h3 className="text-xl font-bold">Delete Testimonial</h3>
                        </div>
                        <p className="mb-4">
                            Are you sure you want to permanently delete this testimonial from <span className="font-semibold">{selectedTestimonial?.user?.name}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="mb-2">{renderStars(selectedTestimonial?.rating)}</div>
                            <p className="text-gray-700">{selectedTestimonial?.text}</p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedTestimonial(null);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteTestimonial}
                                disabled={actionLoading}
                                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${
                                    actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {actionLoading ? 'Deleting...' : 'Delete Testimonial'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestimonialModeration;