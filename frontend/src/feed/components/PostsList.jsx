import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaEllipsisH, FaTrash, FaEllipsisV } from 'react-icons/fa';
import { getImageUrl, ENDPOINTS } from '../../config';
import Loader from '../../components/Loader';

const PostsList = ({ posts, currentUser }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No posts yet. Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostItem key={post._id} post={post} currentUser={currentUser} />
      ))}
    </div>
  );
};

const PostItem = ({ post, currentUser }) => {
  const [liked, setLiked] = useState(post.likes?.includes(currentUser?._id));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCommentMenu, setActiveCommentMenu] = useState(null);

  // Add click outside handler for comment option menus
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeCommentMenu && !event.target.closest(`#comment-menu-container-${activeCommentMenu}`)) {
        const menu = document.getElementById(`comment-options-${activeCommentMenu}`);
        if (menu) {
          menu.classList.add('hidden');
        }
        setActiveCommentMenu(null);
      }
      
      // Also handle post options menu
      if (showOptions && !event.target.closest('.post-options-container')) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeCommentMenu, showOptions]);

  // Function to toggle comment menu
  const toggleCommentMenu = (commentId) => {
    // Close any open menu first
    if (activeCommentMenu) {
      const previousMenu = document.getElementById(`comment-options-${activeCommentMenu}`);
      if (previousMenu) {
        previousMenu.classList.add('hidden');
      }
    }
    
    // Toggle the clicked menu
    const menu = document.getElementById(`comment-options-${commentId}`);
    if (menu) {
      menu.classList.toggle('hidden');
      setActiveCommentMenu(menu.classList.contains('hidden') ? null : commentId);
    }
  };

  // Calculate time remaining before post expires (36 hours from creation)
  const calculateTimeRemaining = () => {
    const createdAt = new Date(post.createdAt);
    const expiresAt = new Date(createdAt.getTime() + 36 * 60 * 60 * 1000); // 36 hours in milliseconds
    const now = new Date();
    
    const timeRemaining = expiresAt - now;
    
    if (timeRemaining <= 0) {
      return 'Expired';
    }
    
    const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hoursRemaining}h ${minutesRemaining}m remaining`;
  };

  // Format the post creation time
  const formatPostTime = () => {
    const createdAt = new Date(post.createdAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdAt) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleLike = async () => {
    try {
      // Optimistically update UI
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
      
      // Make API call
      const token = localStorage.getItem('token');
      const response = await fetch(ENDPOINTS.LIKE_POST(post._id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Revert UI changes if API call fails
        setLiked(liked);
        setLikesCount(liked ? likesCount : likesCount - 1);
        throw new Error('Failed to like post');
      }
      
      // Update with actual data from server
      const data = await response.json();
      setLikesCount(data.likes.length);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(ENDPOINTS.COMMENT_POST(post._id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: commentText })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      const newComment = await response.json();
      
      // Add the comment to the local state
      setComments([...comments, newComment]);
      setCommentText('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      // Hide the post immediately for better UX
      document.getElementById(`post-${post._id}`).style.display = 'none';
      
      const token = localStorage.getItem('token');
      const response = await fetch(ENDPOINTS.DELETE_POST(post._id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Show the post again if deletion fails
        document.getElementById(`post-${post._id}`).style.display = 'block';
        throw new Error('Failed to delete post');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      // Hide the comment immediately for better UX
      document.getElementById(`comment-${commentId}`).style.opacity = '0.5';
      
      const token = localStorage.getItem('token');
      const response = await fetch(ENDPOINTS.DELETE_COMMENT(post._id, commentId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Show the comment again if deletion fails
        document.getElementById(`comment-${commentId}`).style.opacity = '1';
        throw new Error('Failed to delete comment');
      }
      
      // Remove the comment from the local state
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const isOwnPost = post.user?._id === currentUser?._id;

  return (
    <div id={`post-${post._id}`} className="bg-white rounded-lg shadow">
      {/* Post header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full overflow-hidden">
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
            <div className="flex items-center text-xs text-gray-500">
              <span>{formatPostTime()}</span>
              <span className="mx-1">•</span>
              <span className="text-orange-500">{calculateTimeRemaining()}</span>
            </div>
          </div>
        </div>
        
        <div className="relative post-options-container">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <FaEllipsisH />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
              {isOwnPost && (
                <button
                  onClick={handleDeletePost}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <FaTrash className="mr-2" />
                  Delete Post
                </button>
              )}
              <button
                onClick={() => setShowOptions(false)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Report
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Post content */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-gray-800">{post.content}</p>
        </div>
      )}
      
      {/* Post media */}
      {post.media && (
        <div className="relative">
          {post.mediaType === 'image' ? (
            <img 
              src={getImageUrl(post.media)} 
              alt="Post" 
              className="w-full max-h-[500px] object-contain bg-black"
            />
          ) : post.mediaType === 'video' ? (
            <video 
              src={getImageUrl(post.media)} 
              controls 
              className="w-full max-h-[500px]"
            />
          ) : null}
        </div>
      )}
      
      {/* Post stats */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-b">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{likesCount} likes</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{comments.length} comments</span>
        </div>
      </div>
      
      {/* Post actions */}
      <div className="px-4 py-2 flex justify-around">
        <button 
          onClick={handleLike}
          className={`flex items-center space-x-1 ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
          <span>Like</span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
        >
          <FaComment />
          <span>Comment</span>
        </button>
        
        <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500">
          <FaShare />
          <span>Share</span>
        </button>
      </div>
      
      {/* Comments section */}
      {showComments && (
        <div className="px-4 py-3 border-t">
          {/* Comment form */}
          <form onSubmit={handleAddComment} className="flex items-center space-x-2 mb-3">
            <div className="h-8 w-8 rounded-full overflow-hidden">
              {currentUser?.profileImage ? (
                <img 
                  src={getImageUrl(currentUser.profileImage)} 
                  alt={currentUser.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-orange-200 flex items-center justify-center">
                  <span className="text-orange-500 font-semibold">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || isLoading}
              className={`px-3 py-1 rounded-full ${
                !commentText.trim() || isLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {isLoading ? (
                <span className="w-5 h-5">
                  <Loader size="small" />
                </span>
              ) : (
                'Post'
              )}
            </button>
          </form>
          
          {/* Comments list */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {comments.length > 0 ? (
              comments.map(comment => {
                const isOwnComment = comment.user?._id === currentUser?._id;
                const isPostOwner = post.user?._id === currentUser?._id;
                const canDeleteComment = isOwnComment || isPostOwner;
                
                return (
                  <div id={`comment-${comment._id}`} key={comment._id} className="flex space-x-2">
                    <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                      {comment.user?.profileImage ? (
                        <img 
                          src={getImageUrl(comment.user.profileImage)} 
                          alt={comment.user.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-orange-200 flex items-center justify-center">
                          <span className="text-orange-500 font-semibold">
                            {comment.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 relative group">
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-sm">{comment.user?.name}</h4>
                          {canDeleteComment && (
                            <div 
                              id={`comment-menu-container-${comment._id}`}
                              className="relative"
                            >
                              <button 
                                className="text-gray-400 hover:text-gray-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => toggleCommentMenu(comment._id)}
                                title="Comment options"
                              >
                                <FaEllipsisV size={12} />
                              </button>
                              <div 
                                id={`comment-options-${comment._id}`}
                                className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 hidden"
                              >
                                <button
                                  onClick={() => handleDeleteComment(comment._id)}
                                  className="flex items-center w-full px-3 py-2 text-xs text-red-600 hover:bg-gray-100"
                                >
                                  <FaTrash className="mr-2" size={10} />
                                  Delete Comment
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
                        <span>{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <button className="hover:text-orange-500">Like</button>
                        <button className="hover:text-orange-500">Reply</button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsList;