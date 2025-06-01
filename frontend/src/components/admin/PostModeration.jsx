import React, { useState, useEffect } from 'react';
import { FaSearch, FaStar, FaRegStar, FaTrash, FaExclamationTriangle, FaImage, FaVideo, FaCalendarAlt } from 'react-icons/fa';
import { ENDPOINTS, getImageUrl } from '../../config';

const PostModeration = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState('all'); // 'all', 'featured', 'active', 'expired'

    useEffect(() => {
        fetchPosts();
    }, [currentPage, viewMode]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            let url = `${ENDPOINTS.ADMIN_POSTS}?page=${currentPage}`;
            if (viewMode === 'featured') {
                url += '&featured=true';
            } else if (viewMode === 'active') {
                url += '&status=active';
            } else if (viewMode === 'expired') {
                url += '&status=expired';
            }
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data = await response.json();
            setPosts(data.posts);
            setTotalPages(data.totalPages);
            setError(null);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to load posts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFeatured = async (post) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_POSTS}/${post._id}/feature`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update post');
            }

            const data = await response.json();
            
            // Update local state
            setPosts(posts.map(p => 
                p._id === post._id 
                    ? { ...p, featured: data.featured } 
                    : p
            ));
        } catch (err) {
            console.error('Error updating post:', err);
            setError('Failed to update post. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeletePost = async () => {
        if (!selectedPost) return;
        
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_POSTS}/${selectedPost._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            // Update local state
            setPosts(posts.filter(post => post._id !== selectedPost._id));
            
            // Close modal and reset
            setShowDeleteModal(false);
            setSelectedPost(null);
        } catch (err) {
            console.error('Error deleting post:', err);
            setError('Failed to delete post. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    // Format the post creation time
    const formatPostTime = (createdAt) => {
        const postDate = new Date(createdAt);
        return postDate.toLocaleString();
    };

    // Calculate time remaining before post expires
    const calculateTimeRemaining = (createdAt, expiresAt) => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        
        if (now > expiry) {
            return 'Expired';
        }
        
        const timeRemaining = expiry - now;
        const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${hoursRemaining}h ${minutesRemaining}m remaining`;
    };

    // Filter posts based on search term
    const filteredPosts = posts.filter(post => 
        (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (post.user && post.user.name && post.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post.user && post.user.email && post.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading && posts.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Post Moderation</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                    <select
                        value={viewMode}
                        onChange={(e) => {
                            setViewMode(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="all">All Posts</option>
                        <option value="featured">Featured Posts</option>
                        <option value="active">Active Posts</option>
                        <option value="expired">Expired Posts</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Post header */}
                            <div className="p-4 flex justify-between items-center border-b">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                                        {post.user?.profileImage ? (
                                            <img 
                                                src={getImageUrl(post.user.profileImage)} 
                                                alt={post.user.name} 
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-orange-200 flex items-center justify-center">
                                                <span className="text-orange-500 font-semibold">
                                                    {post.user?.name?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{post.user?.name}</h3>
                                        <p className="text-xs text-gray-500">{post.user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleToggleFeatured(post)}
                                        disabled={actionLoading}
                                        className={`text-yellow-500 hover:text-yellow-700 ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        title={post.featured ? "Unmark as featured" : "Mark as featured"}
                                    >
                                        {post.featured ? <FaStar size={18} /> : <FaRegStar size={18} />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedPost(post);
                                            setShowDeleteModal(true);
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                        title="Delete post"
                                    >
                                        <FaTrash size={18} />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Post content */}
                            <div className="p-4">
                                {post.content && (
                                    <p className="text-gray-800 mb-4">{post.content}</p>
                                )}
                                
                                {/* Post media */}
                                {post.media && (
                                    <div className="relative mb-4">
                                        {post.mediaType === 'image' ? (
                                            <div className="relative">
                                                <img 
                                                    src={getImageUrl(post.media)} 
                                                    alt="Post" 
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded">
                                                    <FaImage size={14} />
                                                </div>
                                            </div>
                                        ) : post.mediaType === 'video' ? (
                                            <div className="relative">
                                                <video 
                                                    src={getImageUrl(post.media)} 
                                                    className="w-full h-48 object-cover rounded-lg"
                                                    controls
                                                />
                                                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded">
                                                    <FaVideo size={14} />
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                                
                                {/* Post metadata */}
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-1" />
                                        <span>{formatPostTime(post.createdAt)}</span>
                                    </div>
                                    <div className={`${
                                        calculateTimeRemaining(post.createdAt, post.expiresAt) === 'Expired' 
                                            ? 'text-red-500' 
                                            : 'text-orange-500'
                                    }`}>
                                        {calculateTimeRemaining(post.createdAt, post.expiresAt)}
                                    </div>
                                </div>
                                
                                {/* Post stats */}
                                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                                    <span>{post.likes?.length || 0} likes</span>
                                    <span>{post.comments?.length || 0} comments</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center py-10 bg-white rounded-lg shadow-md">
                        <p className="text-gray-500">
                            {searchTerm ? 'No posts match your search.' : 'No posts found.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <nav className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md ${
                                currentPage === 1 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-orange-500 text-white hover:bg-orange-600'
                            }`}
                        >
                            Previous
                        </button>
                        
                        <span className="text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md ${
                                currentPage === totalPages 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-orange-500 text-white hover:bg-orange-600'
                            }`}
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}

            {/* Delete Post Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center mb-4 text-red-600">
                            <FaExclamationTriangle size={24} className="mr-2" />
                            <h3 className="text-xl font-bold">Delete Post</h3>
                        </div>
                        <p className="mb-4">
                            Are you sure you want to permanently delete this post by <span className="font-semibold">{selectedPost?.user?.name}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedPost(null);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeletePost}
                                disabled={actionLoading}
                                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${
                                    actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {actionLoading ? 'Processing...' : 'Delete Post'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostModeration;