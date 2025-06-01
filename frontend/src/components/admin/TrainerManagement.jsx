import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUserPlus, FaEdit, FaTrash, FaExclamationTriangle, FaUpload, FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaPlus } from 'react-icons/fa';
import { ENDPOINTS, getImageUrl } from '../../config';

const TrainerManagement = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        bio: '',
        email: '',
        phone: '',
        experience: '',
        certifications: [],
        socialMedia: {
            instagram: '',
            facebook: '',
            twitter: '',
            linkedin: ''
        }
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(ENDPOINTS.ADMIN_TRAINERS, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch trainers');
            }

            const data = await response.json();
            setTrainers(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching trainers:', err);
            setError('Failed to load trainers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith('social-')) {
            const socialField = name.replace('social-', '');
            setFormData({
                ...formData,
                socialMedia: {
                    ...formData.socialMedia,
                    [socialField]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleCertificationChange = (index, value) => {
        const updatedCertifications = [...formData.certifications];
        updatedCertifications[index] = value;
        setFormData({
            ...formData,
            certifications: updatedCertifications
        });
    };

    const addCertificationField = () => {
        setFormData({
            ...formData,
            certifications: [...formData.certifications, '']
        });
    };

    const removeCertificationField = (index) => {
        const updatedCertifications = [...formData.certifications];
        updatedCertifications.splice(index, 1);
        setFormData({
            ...formData,
            certifications: updatedCertifications
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

    const resetForm = () => {
        setFormData({
            name: '',
            specialty: '',
            bio: '',
            email: '',
            phone: '',
            experience: '',
            certifications: [],
            socialMedia: {
                instagram: '',
                facebook: '',
                twitter: '',
                linkedin: ''
            }
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAddTrainer = async (e) => {
        e.preventDefault();
        
        try {
            setActionLoading(true);
            setError(null);
            setSuccess(null);
            
            const token = localStorage.getItem('token');
            
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('specialty', formData.specialty);
            formDataToSend.append('bio', formData.bio);
            
            if (formData.email) formDataToSend.append('email', formData.email);
            if (formData.phone) formDataToSend.append('phone', formData.phone);
            if (formData.experience) formDataToSend.append('experience', formData.experience);
            
            if (formData.certifications.length > 0) {
                formDataToSend.append('certifications', JSON.stringify(formData.certifications.filter(cert => cert.trim() !== '')));
            }
            
            formDataToSend.append('socialMedia', JSON.stringify(formData.socialMedia));
            
            if (selectedFile) {
                formDataToSend.append('profileImage', selectedFile);
            }
            
            const response = await fetch(ENDPOINTS.ADMIN_TRAINERS, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to add trainer');
            }

            const newTrainer = await response.json();
            
            // Update local state
            setTrainers([...trainers, newTrainer]);
            
            // Reset form and close modal
            resetForm();
            setShowAddModal(false);
            setSuccess('Trainer added successfully!');
        } catch (err) {
            console.error('Error adding trainer:', err);
            setError('Failed to add trainer. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditTrainer = async (e) => {
        e.preventDefault();
        
        if (!selectedTrainer) return;
        
        try {
            setActionLoading(true);
            setError(null);
            setSuccess(null);
            
            const token = localStorage.getItem('token');
            
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('specialty', formData.specialty);
            formDataToSend.append('bio', formData.bio);
            
            if (formData.email) formDataToSend.append('email', formData.email);
            if (formData.phone) formDataToSend.append('phone', formData.phone);
            if (formData.experience) formDataToSend.append('experience', formData.experience);
            
            if (formData.certifications.length > 0) {
                formDataToSend.append('certifications', JSON.stringify(formData.certifications.filter(cert => cert.trim() !== '')));
            }
            
            formDataToSend.append('socialMedia', JSON.stringify(formData.socialMedia));
            
            if (selectedFile) {
                formDataToSend.append('profileImage', selectedFile);
            }
            
            const response = await fetch(`${ENDPOINTS.ADMIN_TRAINERS}/${selectedTrainer._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update trainer');
            }

            const updatedTrainer = await response.json();
            
            // Update local state
            setTrainers(trainers.map(t => 
                t._id === selectedTrainer._id ? updatedTrainer : t
            ));
            
            // Reset form and close modal
            resetForm();
            setShowEditModal(false);
            setSelectedTrainer(null);
            setSuccess('Trainer updated successfully!');
        } catch (err) {
            console.error('Error updating trainer:', err);
            setError('Failed to update trainer. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteTrainer = async () => {
        if (!selectedTrainer) return;
        
        try {
            setActionLoading(true);
            setError(null);
            setSuccess(null);
            
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${ENDPOINTS.ADMIN_TRAINERS}/${selectedTrainer._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.assignedClasses) {
                    throw new Error(`Cannot delete trainer as they are assigned to classes: ${errorData.assignedClasses.join(', ')}`);
                }
                throw new Error('Failed to delete trainer');
            }

            // Update local state
            setTrainers(trainers.filter(t => t._id !== selectedTrainer._id));
            
            // Close modal and reset
            setShowDeleteModal(false);
            setSelectedTrainer(null);
            setSuccess('Trainer deleted successfully!');
        } catch (err) {
            console.error('Error deleting trainer:', err);
            setError(err.message || 'Failed to delete trainer. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    // Filter trainers based on search term
    const filteredTrainers = trainers.filter(trainer => 
        trainer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        trainer.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.bio?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && trainers.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Trainer Management</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search trainers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowAddModal(true);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <FaUserPlus className="mr-2" />
                        Add Trainer
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    <p>{error}</p>
                </div>
            )}
            
            {success && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
                    <p>{success}</p>
                </div>
            )}

            {filteredTrainers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTrainers.map(trainer => (
                        <div key={trainer._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="relative h-48">
                                {trainer.profileImage ? (
                                    <img 
                                        src={getImageUrl(trainer.profileImage)} 
                                        alt={trainer.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400 text-4xl">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-800">{trainer.name}</h3>
                                <p className="text-orange-500 font-medium">{trainer.specialty}</p>
                                <p className="text-gray-600 mt-2 line-clamp-3">{trainer.bio}</p>
                                
                                {trainer.certifications && trainer.certifications.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">Certifications:</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {trainer.certifications.map((cert, index) => (
                                                <span 
                                                    key={index} 
                                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                                >
                                                    {cert}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mt-3 flex space-x-2">
                                    {trainer.socialMedia?.instagram && (
                                        <a href={trainer.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600">
                                            <FaInstagram size={18} />
                                        </a>
                                    )}
                                    {trainer.socialMedia?.facebook && (
                                        <a href={trainer.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                            <FaFacebook size={18} />
                                        </a>
                                    )}
                                    {trainer.socialMedia?.twitter && (
                                        <a href={trainer.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                                            <FaTwitter size={18} />
                                        </a>
                                    )}
                                    {trainer.socialMedia?.linkedin && (
                                        <a href={trainer.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800">
                                            <FaLinkedin size={18} />
                                        </a>
                                    )}
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        {trainer.experience ? `${trainer.experience} years experience` : 'Experience not specified'}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedTrainer(trainer);
                                                setFormData({
                                                    name: trainer.name,
                                                    specialty: trainer.specialty,
                                                    bio: trainer.bio,
                                                    email: trainer.email || '',
                                                    phone: trainer.phone || '',
                                                    experience: trainer.experience || '',
                                                    certifications: trainer.certifications || [],
                                                    socialMedia: {
                                                        instagram: trainer.socialMedia?.instagram || '',
                                                        facebook: trainer.socialMedia?.facebook || '',
                                                        twitter: trainer.socialMedia?.twitter || '',
                                                        linkedin: trainer.socialMedia?.linkedin || ''
                                                    }
                                                });
                                                setPreviewUrl(trainer.profileImage ? getImageUrl(trainer.profileImage) : null);
                                                setShowEditModal(true);
                                            }}
                                            className="p-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                                            title="Edit Trainer"
                                        >
                                            <FaEdit size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedTrainer(trainer);
                                                setShowDeleteModal(true);
                                            }}
                                            className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
                                            title="Delete Trainer"
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
                    <div className="text-4xl text-gray-300 mb-4">👨‍🏫</div>
                    <p className="text-gray-500">
                        {searchTerm 
                            ? 'No trainers match your search.' 
                            : 'No trainers have been added yet.'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => {
                                resetForm();
                                setShowAddModal(true);
                            }}
                            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center"
                        >
                            <FaUserPlus className="mr-2" />
                            Add Your First Trainer
                        </button>
                    )}
                </div>
            )}

            {/* Add Trainer Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Trainer</h3>
                        
                        <form onSubmit={handleAddTrainer}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 mb-2">
                                        {previewUrl ? (
                                            <div className="relative">
                                                <img 
                                                    src={previewUrl} 
                                                    alt="Preview" 
                                                    className="max-h-60 max-w-full rounded"
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
                                                <FaUpload className="mx-auto text-4xl text-gray-300 mb-2" />
                                                <p className="text-gray-500 text-sm mb-2">Upload a profile image</p>
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
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                        Name*
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter trainer name"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specialty">
                                        Specialty*
                                    </label>
                                    <input
                                        type="text"
                                        id="specialty"
                                        name="specialty"
                                        value={formData.specialty}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="E.g., Yoga, CrossFit, Nutrition"
                                        required
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                                        Bio*
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter trainer bio"
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter email address"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experience">
                                        Years of Experience
                                    </label>
                                    <input
                                        type="number"
                                        id="experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter years of experience"
                                        min="0"
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Certifications
                                    </label>
                                    {formData.certifications.map((cert, index) => (
                                        <div key={index} className="flex items-center mb-2">
                                            <input
                                                type="text"
                                                value={cert}
                                                onChange={(e) => handleCertificationChange(index, e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                placeholder={`Certification ${index + 1}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeCertificationField(index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addCertificationField}
                                        className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                                    >
                                        <FaPlus className="mr-1" size={12} />
                                        Add Certification
                                    </button>
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Social Media Links
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <FaInstagram className="text-pink-500 mr-2" size={20} />
                                            <input
                                                type="url"
                                                name="social-instagram"
                                                value={formData.socialMedia.instagram}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                placeholder="Instagram URL"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <FaFacebook className="text-blue-600 mr-2" size={20} />
                                            <input
                                                type="url"
                                                name="social-facebook"
                                                value={formData.socialMedia.facebook}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                placeholder="Facebook URL"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <FaTwitter className="text-blue-400 mr-2" size={20} />
                                            <input
                                                type="url"
                                                name="social-twitter"
                                                value={formData.socialMedia.twitter}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                placeholder="Twitter URL"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <FaLinkedin className="text-blue-700 mr-2" size={20} />
                                            <input
                                                type="url"
                                                name="social-linkedin"
                                                value={formData.socialMedia.linkedin}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                placeholder="LinkedIn URL"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setShowAddModal(false);
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className={`px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 ${
                                        actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {actionLoading ? 'Adding...' : 'Add Trainer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Edit Trainer Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Trainer</h3>
                        
                        <form onSubmit={handleEditTrainer}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 mb-2">
                                        {previewUrl ? (
                                            <div className="relative">
                                                <img 
                                                    src={previewUrl} 
                                                    alt="Preview" 
                                                    className="max-h-60 max-w-full rounded"
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
                                                <FaUpload className="mx-auto text-4xl text-gray-300 mb-2" />
                                                <p className="text-gray-500 text-sm mb-2">Upload a profile image</p>
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
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">
                                        Name*
                                    </label>
                                    <input
                                        type="text"
                                        id="edit-name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter trainer name"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-specialty">
                                        Specialty*
                                    </label>
                                    <input
                                        type="text"
                                        id="edit-specialty"
                                        name="specialty"
                                        value={formData.specialty}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="E.g., Yoga, CrossFit, Nutrition"
                                        required
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-bio">
                                        Bio*
                                    </label>
                                    <textarea
                                        id="edit-bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter trainer bio"
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-email">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="edit-email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter email address"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-phone">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        id="edit-phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-experience">
                                        Years of Experience
                                    </label>
                                    <input
                                        type="number"
                                        id="edit-experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter years of experience"
                                        min="0"
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Certifications
                                    </label>
                                    {formData.certifications.map((cert, index) => (
                                        <div key={index} className="flex items-center mb-2">
                                            <input
                                                type="text"
                                                value={cert}
                                                onChange={(e) => handleCertificationChange(index, e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                placeholder={`Certification ${index + 1}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeCertificationField(index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addCertificationField}
                                        className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                                    >
                                        <FaPlus className="mr-1" size={12} />
                                        Add Certification
                                    </button>
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Social Media Links
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <FaInstagram className="text-pink-500 mr-2" size={20} />
                                            <input
                                                type="url"
                                                name="social-instagram"
                                                value={formData.socialMedia.instagram}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                placeholder="Instagram URL"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <FaFacebook className="text-blue-600 mr-2" size={20} />
                                            <input
                                                type="url"
                                                name="social-facebook"
                                                value={formData.socialMedia.facebook}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                placeholder="Facebook URL"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <FaTwitter className="text-blue-400 mr-2" size={20} />
                                            <input
                                                type="url"
                                                name="social-twitter"
                                                value={formData.socialMedia.twitter}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                placeholder="Twitter URL"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <FaLinkedin className="text-blue-700 mr-2" size={20} />
                                            <input
                                                type="url"
                                                name="social-linkedin"
                                                value={formData.socialMedia.linkedin}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                placeholder="LinkedIn URL"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedTrainer(null);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className={`px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 ${
                                        actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {actionLoading ? 'Updating...' : 'Update Trainer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Trainer Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center mb-4 text-red-600">
                            <FaExclamationTriangle size={24} className="mr-2" />
                            <h3 className="text-xl font-bold">Delete Trainer</h3>
                        </div>
                        <p className="mb-4">
                            Are you sure you want to permanently delete <span className="font-semibold">{selectedTrainer?.name}</span>?
                            This action cannot be undone and will remove all associated data including classes and schedules.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedTrainer(null);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteTrainer}
                                disabled={actionLoading}
                                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${
                                    actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {actionLoading ? 'Deleting...' : 'Delete Trainer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainerManagement;