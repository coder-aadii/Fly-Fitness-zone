import React, { useState, useEffect, useRef } from 'react';
import { FaImages, FaUpload, FaTrash, FaStar, FaRegStar, FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import { ENDPOINTS, getImageUrl } from '../../config';

const GalleryManagement = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    // Fixed: Removed unused setCategories
    const [categories] = useState([
        'Gym Facilities', 'Classes', 'Events', 'Trainers', 'Members', 'Equipment'
    ]);
    const [uploadData, setUploadData] = useState({
        title: '',
        description: '',
        category: 'Gym Facilities',
        featured: false
    });
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchImages();
    }, [filterCategory]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchImages = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            let url = ENDPOINTS.ADMIN_GALLERY;
            if (filterCategory !== 'all') {
                url += `?category=${filterCategory}`;
            }
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch gallery images');
            }

            const data = await response.json();
            console.log('Gallery API response:', data);
            
            // Ensure data is an array
            if (Array.isArray(data)) {
                setImages(data);
            } else if (data && typeof data === 'object' && data.images && Array.isArray(data.images)) {
                // Handle case where images are nested in an object
                setImages(data.images);
            } else {
                console.error('API returned non-array data:', data);
                setImages([]);
                setError('Received invalid data format from server. Check console for details.');
            }
        } catch (err) {
            console.error('Error fetching gallery images:', err);
            setError('Failed to load gallery images. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUploadData({
            ...uploadData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            setError('Please select an image to upload');
            return;
        }
        
        try {
            setUploadLoading(true);
            setError(null);
            setSuccess(null);
            
            const token = localStorage.getItem('token');
            
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('title', uploadData.title);
            formData.append('description', uploadData.description);
            formData.append('category', uploadData.category);
            formData.append('featured', uploadData.featured);
            
            const response = await fetch(ENDPOINTS.ADMIN_GALLERY_UPLOAD, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const newImage = await response.json();
            
            // Update local state
            if (Array.isArray(images)) {
                setImages([newImage, ...images]);
            } else {
                setImages([newImage]);
            }
            
            // Reset form
            setUploadData({
                title: '',
                description: '',
                category: 'Gym Facilities',
                featured: false
            });
            setSelectedFile(null);
            setPreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            setSuccess('Image uploaded successfully!');
        } catch (err) {
            console.error('Error uploading image:', err);
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploadLoading(false);
        }
    };

    const handleToggleFeatured = async (image) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_GALLERY}/${image._id}/feature`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update image');
            }

            const data = await response.json();
            
            // Update local state
            if (Array.isArray(images)) {
                setImages(images.map(img => 
                    img._id === image._id 
                        ? { ...img, featured: data.featured } 
                        : img
                ));
            }
        } catch (err) {
            console.error('Error updating image:', err);
            setError('Failed to update image. Please try again.');
        }
    };

    const handleDeleteImage = async () => {
        if (!selectedImage) return;
        
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_GALLERY}/${selectedImage._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete image');
            }

            // Update local state
            if (Array.isArray(images)) {
                setImages(images.filter(img => img._id !== selectedImage._id));
            }
            
            // Close modal and reset
            setShowDeleteModal(false);
            setSelectedImage(null);
        } catch (err) {
            console.error('Error deleting image:', err);
            setError('Failed to delete image. Please try again.');
        }
    };

    // Filter images based on search term
    const filteredImages = Array.isArray(images) ? images.filter(image => {
        // Fixed: Added parentheses to clarify operator precedence
        return (
            (image && image.title && typeof image.title === 'string' && image.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (image && image.description && typeof image.description === 'string' && image.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (image && image.category && typeof image.category === 'string' && image.category.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }) : [];

    if (loading && images.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gallery Management</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Upload Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <FaUpload className="mr-2 text-orange-500" />
                        Upload New Image
                    </h3>
                    
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                            <p>{success}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleUpload}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                                Select Image
                            </label>
                            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 mb-2">
                                {previewUrl ? (
                                    <div className="relative">
                                        <img 
                                            src={previewUrl} 
                                            alt="Preview" 
                                            className="max-h-40 max-w-full rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setPreviewUrl(null);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            title="Remove"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <FaImages className="mx-auto text-4xl text-gray-300 mb-2" />
                                        <p className="text-gray-500 text-sm mb-2">Drag and drop an image here or click to browse</p>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current.click()}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                        >
                                            Browse Files
                                        </button>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="image"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={uploadData.title}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter image title"
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
                                value={uploadData.description}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter image description"
                                rows="3"
                                required
                            ></textarea>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={uploadData.category}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="mb-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={uploadData.featured}
                                    onChange={handleInputChange}
                                    className="form-checkbox h-4 w-4 text-orange-500"
                                />
                                <span className="ml-2 text-gray-700">Feature this image</span>
                            </label>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={uploadLoading || !selectedFile}
                            className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center ${
                                uploadLoading || !selectedFile ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <FaUpload className="mr-2" />
                            {uploadLoading ? 'Uploading...' : 'Upload Image'}
                        </button>
                    </form>
                </div>
                
                {/* Gallery Management */}
                <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <FaImages className="mr-2 text-orange-500" />
                            Gallery Images
                        </h3>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search images..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            </div>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {filteredImages.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredImages.map(image => (
                                <div key={image._id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="relative">
                                        <img 
                                            src={getImageUrl(image.url)} 
                                            alt={image.title} 
                                            className="w-full h-40 object-cover"
                                        />
                                        <div className="absolute top-2 right-2 flex space-x-1">
                                            <button
                                                onClick={() => handleToggleFeatured(image)}
                                                className={`p-1 rounded-full ${
                                                    image.featured 
                                                        ? 'bg-yellow-500 text-white' 
                                                        : 'bg-gray-200 text-gray-600'
                                                }`}
                                                title={image.featured ? "Unmark as featured" : "Mark as featured"}
                                            >
                                                {image.featured ? <FaStar size={14} /> : <FaRegStar size={14} />}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedImage(image);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="p-1 rounded-full bg-red-500 text-white"
                                                title="Delete image"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-semibold text-gray-800 truncate">{image.title}</h4>
                                        <p className="text-xs text-gray-500 mb-1">{image.category}</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <FaImages className="text-4xl text-gray-300 mb-3" />
                            <p className="text-gray-500">
                                {searchTerm || filterCategory !== 'all' 
                                    ? 'No images match your search or filter.' 
                                    : 'No images have been uploaded yet.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Delete Image Modal */}
            {showDeleteModal && selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center mb-4 text-red-600">
                            <FaExclamationTriangle size={24} className="mr-2" />
                            <h3 className="text-xl font-bold">Delete Image</h3>
                        </div>
                        <div className="mb-4">
                            {selectedImage.url && (
                                <img 
                                    src={getImageUrl(selectedImage.url)} 
                                    alt={selectedImage.title || 'Image'} 
                                    className="w-full h-48 object-contain border border-gray-200 rounded-lg"
                                />
                            )}
                        </div>
                        <p className="mb-4">
                            Are you sure you want to permanently delete <span className="font-semibold">{selectedImage?.title || 'this image'}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedImage(null);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteImage}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete Image
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryManagement;