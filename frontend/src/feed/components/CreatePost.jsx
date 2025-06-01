import React, { useState, useRef } from 'react';
import { FaImage, FaTimes, FaSmile, FaRunning, FaGrinBeam, FaAngry, FaTrophy, FaHeartbeat, FaDumbbell, FaFire } from 'react-icons/fa';
import Loader from '../../components/Loader';
import { getImageUrl, ENDPOINTS } from '../../config';

// Predefined feelings with emojis for fitness context
const FEELINGS = [
  { id: 'energetic', text: 'energetic', icon: <FaFire className="text-orange-500" /> },
  { id: 'fit', text: 'fit', icon: <FaDumbbell className="text-blue-500" /> },
  { id: 'accomplished', text: 'accomplished', icon: <FaTrophy className="text-yellow-500" /> },
  { id: 'motivated', text: 'motivated', icon: <FaHeartbeat className="text-red-500" /> },
  { id: 'happy', text: 'happy', icon: <FaGrinBeam className="text-yellow-500" /> },
  { id: 'exhausted', text: 'exhausted', icon: <FaRunning className="text-gray-500" /> },
  { id: 'challenged', text: 'challenged', icon: <FaAngry className="text-red-500" /> },
];

const CreatePost = ({ user, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFeelingMenu, setShowFeelingMenu] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const fileInputRef = useRef(null);
  const feelingMenuRef = useRef(null);

  // Close feeling menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFeelingMenu) {
        const feelingPopup = document.getElementById('feeling-menu-popup');
        const isClickInsideFeelingButton = feelingMenuRef.current && feelingMenuRef.current.contains(event.target);
        const isClickInsideFeelingPopup = feelingPopup && feelingPopup.contains(event.target);
        
        if (!isClickInsideFeelingButton && !isClickInsideFeelingPopup) {
          setShowFeelingMenu(false);
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
  }, [showFeelingMenu]);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const fileType = file.type.split('/')[0];
    if (fileType !== 'image' && fileType !== 'video') {
      setError('Please upload an image or video file');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }

    setMediaFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview({
        url: reader.result,
        type: fileType
      });
    };
    reader.readAsDataURL(file);
    
    setError('');
  };

  const removeMedia = () => {
    setMediaPreview(null);
    setMediaFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectFeeling = (feeling) => {
    setSelectedFeeling(feeling);
    setShowFeelingMenu(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !mediaFile) {
      setError('Please add some text or media to your post');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add feeling to content if selected
      const postContent = selectedFeeling 
        ? `${content} - feeling ${selectedFeeling.text}` 
        : content;
      
      formData.append('content', postContent);
      if (mediaFile) {
        formData.append('media', mediaFile);
      }
      
      const response = await fetch(ENDPOINTS.CREATE_POST, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }
      
      const newPost = await response.json();
      
      // Clear form
      setContent('');
      removeMedia();
      setSelectedFeeling(null);
      
      // Notify parent component
      onPostCreated(newPost);
      
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message || 'An error occurred while creating your post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-start space-x-3">
        <div className="h-10 w-10 rounded-full overflow-hidden">
          {user?.profileImage ? (
            <img 
              src={getImageUrl(user.profileImage)} 
              alt={user.name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-orange-200 flex items-center justify-center">
              <span className="text-orange-500 font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`What's on your mind, ${user?.name?.split(' ')[0] || 'there'}?`}
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows={mediaPreview ? 2 : 3}
            />
            
            {error && (
              <div className="text-red-500 text-sm mt-1 mb-2">
                {error}
              </div>
            )}
            
            {mediaPreview && (
              <div className="relative mt-2 mb-3">
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-100"
                >
                  <FaTimes />
                </button>
                {mediaPreview.type === 'image' ? (
                  <img 
                    src={mediaPreview.url} 
                    alt="Preview" 
                    className="max-h-60 rounded-lg mx-auto"
                  />
                ) : (
                  <video 
                    src={mediaPreview.url} 
                    controls 
                    className="max-h-60 rounded-lg mx-auto"
                  />
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaChange}
                  accept="image/*,video/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-gray-500 hover:text-orange-500 p-2 rounded-full hover:bg-gray-100"
                >
                  <FaImage />
                </button>
                <div className="relative" ref={feelingMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowFeelingMenu(!showFeelingMenu)}
                    className="text-gray-500 hover:text-orange-500 p-2 rounded-full hover:bg-gray-100"
                    title="How are you feeling?"
                  >
                    <FaSmile />
                  </button>
                  
                  {showFeelingMenu && (
                    <div id="feeling-menu-popup" className="absolute top-full mt-2 left-0 z-20 bg-white rounded-lg shadow-lg p-3 w-64 max-w-[calc(100vw-2rem)]">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-700">How are you feeling?</h4>
                        <button 
                          onClick={() => setShowFeelingMenu(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {FEELINGS.map(feeling => (
                          <button
                            key={feeling.id}
                            onClick={() => selectFeeling(feeling)}
                            className="flex items-center p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <span className="mr-2">{feeling.icon}</span>
                            <span className="text-sm capitalize">{feeling.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedFeeling && (
                  <div className="ml-2 flex items-center text-gray-600">
                    <span className="mr-1">Feeling:</span>
                    <span className="flex items-center">
                      {selectedFeeling.icon}
                      <span className="ml-1 text-sm capitalize">{selectedFeeling.text}</span>
                    </span>
                    <button 
                      onClick={() => setSelectedFeeling(null)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoading || (!content.trim() && !mediaFile)}
                className={`px-4 py-2 rounded-lg ${
                  isLoading || (!content.trim() && !mediaFile)
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="w-5 h-5 mr-2">
                      <Loader size="small" />
                    </span>
                    <span>Posting...</span>
                  </span>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </form>
          
          <div className="text-xs text-gray-500 mt-2">
            Posts will automatically be deleted after 24 hours
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;