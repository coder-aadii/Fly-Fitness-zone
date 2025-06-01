import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaEllipsisH, FaTrash, FaEllipsisV, FaWhatsapp, FaFacebook, FaTwitter, FaLink, FaTimes, FaInstagram, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { getImageUrl, ENDPOINTS } from '../../config';
import Loader from '../../components/Loader';
import './PostsList.css';

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
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showInstruction, setShowInstruction] = useState(false);
  const shareMenuRef = useRef(null);
  const videoRef = useRef(null);
  const postRef = useRef(null);

  // Add Intersection Observer for video autoplay
  useEffect(() => {
    // Only set up observer if this post has a video
    if (post.mediaType === 'video' && videoRef.current) {
      // Store a reference to the video element that won't change
      const videoElement = videoRef.current;
      
      const options = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.5 // 50% of the video must be visible
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Video is visible, play it
            if (videoElement && videoElement.paused) {
              videoElement.play().catch(e => {
                // Auto-play might be blocked by browser settings
                console.log('Auto-play prevented:', e);
              });
              
              // Show instruction briefly when video first comes into view
              setShowInstruction(true);
              setTimeout(() => {
                setShowInstruction(false);
              }, 1500);
            }
          } else {
            // Video is not visible, pause it
            if (videoElement && !videoElement.paused) {
              videoElement.pause();
            }
          }
        });
      }, options);

      // Start observing the video element
      observer.observe(videoElement);

      // Clean up the observer when component unmounts
      return () => {
        // Use the stored reference in the cleanup function
        observer.unobserve(videoElement);
      };
    }
  }, [post.mediaType]);

  // Add click outside handler for comment option menus and share popup
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

      // Handle share options menu
      if (showShareOptions) {
        const sharePopup = document.getElementById('share-options-popup');
        const isClickInsideShareButton = shareMenuRef.current && shareMenuRef.current.contains(event.target);
        const isClickInsideSharePopup = sharePopup && sharePopup.contains(event.target);
        
        if (!isClickInsideShareButton && !isClickInsideSharePopup) {
          setShowShareOptions(false);
        }
      }
    };

    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);
    
    // Add event listener for touch events to handle mobile better
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [activeCommentMenu, showOptions, showShareOptions]);

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

  // Calculate time remaining before post expires (24 hours from creation)
  const calculateTimeRemaining = () => {
    const createdAt = new Date(post.createdAt);
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
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

  const handleShare = (platform) => {
    // Get the base URL of the application
    const baseUrl = window.location.origin;
    
    // Create a shareable link to this post
    const postUrl = `${baseUrl}/post/${post._id}`;
    
    // Share text
    const shareText = `Check out this post from Fly Fitness Zone: ${post.content?.substring(0, 50)}${post.content?.length > 50 ? '...' : ''}`;
    
    let shareUrl;
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + postUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct share URL like other platforms
        // We'll copy the link to clipboard and show instructions
        navigator.clipboard.writeText(postUrl)
          .then(() => {
            alert('Link copied to clipboard! Open Instagram and paste in your story or direct message.');
          })
          .catch(err => {
            console.error('Failed to copy link: ', err);
          });
        setShowShareOptions(false);
        return;
      case 'copy':
        navigator.clipboard.writeText(postUrl)
          .then(() => {
            alert('Link copied to clipboard!');
          })
          .catch(err => {
            console.error('Failed to copy link: ', err);
          });
        setShowShareOptions(false);
        return;
      default:
        return;
    }
    
    // Open share URL in a new window
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
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
    <div id={`post-${post._id}`} ref={postRef} className="bg-white rounded-lg shadow">
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
            <div className="absolute right-0 mt-1 w-48 max-w-[calc(100vw-2rem)] bg-white rounded-md shadow-lg z-10">
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
              style={{ maxWidth: '100%' }}
            />
          ) : post.mediaType === 'video' ? (
            <div className="video-container relative group">
              <video 
                ref={videoRef}
                src={getImageUrl(post.media)} 
                className="w-full max-h-[500px]"
                style={{ maxWidth: '100%' }}
                loop
                muted={isMuted}
                playsInline
                onClick={() => {
                  // Toggle mute on click
                  setIsMuted(!isMuted);
                  
                  // Show instruction briefly
                  setShowInstruction(true);
                  setTimeout(() => {
                    setShowInstruction(false);
                  }, 1500); // Hide after 1.5 seconds
                }}
              />
              <div className={`tap-instruction pointer-events-none ${showInstruction ? 'show' : ''}`}>
                {isMuted ? 'Sound off' : 'Sound on'}
              </div>
              <div className="volume-indicator pointer-events-none" onClick={(e) => e.stopPropagation()}>
                {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
              </div>
            </div>
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
        
        <div className="relative" ref={shareMenuRef}>
          <button 
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="flex items-center space-x-1 text-gray-500 hover:text-green-500"
          >
            <FaShare />
            <span>Share</span>
          </button>
          
          {showShareOptions && (
            <div id="share-options-popup" className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg p-3 z-20 w-48 max-w-[calc(100vw-2rem)]">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700">Share to</h4>
                <button 
                  onClick={() => setShowShareOptions(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={14} />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FaWhatsapp className="text-green-500 text-xl mb-1" />
                  <span className="text-xs">WhatsApp</span>
                </button>
                
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FaFacebook className="text-blue-600 text-xl mb-1" />
                  <span className="text-xs">Facebook</span>
                </button>
                
                <button
                  onClick={() => handleShare('instagram')}
                  className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FaInstagram className="text-pink-500 text-xl mb-1" />
                  <span className="text-xs">Instagram</span>
                </button>
                
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FaTwitter className="text-blue-400 text-xl mb-1" />
                  <span className="text-xs">Twitter</span>
                </button>
                
                <button
                  onClick={() => handleShare('copy')}
                  className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FaLink className="text-gray-500 text-xl mb-1" />
                  <span className="text-xs">Copy Link</span>
                </button>
                
                <div></div> {/* Empty div for grid alignment */}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Comments section */}
      {showComments && (
        <div className="px-4 py-3 border-t">
          {/* Comment form */}
          <form onSubmit={handleAddComment} className="flex items-center space-x-2 mb-3 flex-wrap sm:flex-nowrap">
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
                                className="absolute right-0 mt-1 w-32 max-w-[calc(100vw-3rem)] bg-white rounded-md shadow-lg z-10 hidden"
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