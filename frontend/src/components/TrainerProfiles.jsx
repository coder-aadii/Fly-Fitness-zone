import React, { useState, useEffect } from 'react';
import { FaInstagram, FaWhatsapp, FaLinkedin, FaFacebook, FaTwitter } from 'react-icons/fa';
import { ENDPOINTS, getImageUrl } from '../config';

// Fallback trainers data in case API fails
const fallbackTrainers = [
    {
        name: 'Ritesh Sontani',
        specialty: 'Certified Zumba Instructor',
        profileImage: 'https://res.cloudinary.com/deoegf9on/image/upload/v1748371451/Screenshot_2025_0528_001220_q10mk2.jpg',
        bio: 'Ritesh brings energy and passion to every Zumba class. With years of experience and official certification, he ensures every session feels like a party while helping you burn calories and build stamina.',
        socialMedia: {
            instagram: 'https://www.instagram.com/ritesh_sontani?igsh=MWtidWM4ZmQyM3VsNA==',
        },
        phone: '+919406681919'
    },
    {
        name: 'Aditya Aerpule',
        specialty: 'Certified Yoga Instructor',
        profileImage: 'https://res.cloudinary.com/deoegf9on/image/upload/v1748371452/1000155185_wkpz7i.jpg',
        bio: 'Aditya blends traditional yoga with modern fitness techniques. His expertise in Yoga, Meditation, and YogNidra helps students improve flexibility, reduce stress, and gain inner peace.',
        socialMedia: {
            instagram: 'https://www.instagram.com/mr_aadi.insane?igsh=cTVoNXF6Zm13eThi',
        },
        phone: '+919074703157'
    },
    {
        name: 'Jigyasa Bhatia',
        specialty: 'Certified Zumba Instructor',
        profileImage: 'https://res.cloudinary.com/deoegf9on/image/upload/v1748371451/Screenshot_2025_0528_001305_c746xc.jpg',
        bio: "With her vibrant energy and rhythmic finesse, Jigyasa creates an uplifting environment in every class. She's dedicated to making fitness fun and accessible for all.",
        socialMedia: {
            instagram: 'https://www.instagram.com/jigyasabhatia?igsh=bWJ4bzY3aHlicTUy',
        },
        phone: '+919179717777'
    },
];

const TrainerProfiles = () => {
    const [trainers, setTrainers] = useState(fallbackTrainers);
    const [loading, setLoading] = useState(true);
    // We're removing the unused error variable or using it with eslint-disable comment
    const [, setError] = useState(null);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                setLoading(true);
                const response = await fetch(ENDPOINTS.ADMIN_TRAINERS);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch trainers');
                }
                
                const data = await response.json();
                
                // Filter to only show active trainers
                const activeTrainers = Array.isArray(data) 
                    ? data.filter(trainer => trainer.active !== false)
                    : [];
                
                if (activeTrainers.length > 0) {
                    setTrainers(activeTrainers);
                }
                
                setError(null);
            } catch (err) {
                console.error('Error fetching trainers:', err);
                // Keep using fallback trainers if fetch fails
            } finally {
                setLoading(false);
            }
        };
        
        fetchTrainers();
    }, []);
    return (
        <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8" id='trainers'>
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-900">Meet Our Trainers</h2>
                <p className="mt-4 text-gray-600">
                    Our experienced and certified trainers are here to guide you every step of the way in your fitness journey.
                </p>
            </div>
            {loading && trainers.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            ) : (
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                    {trainers.map((trainer, index) => (
                        <div key={trainer._id || index} className="bg-white shadow-md rounded-lg overflow-hidden text-center p-6">
                            <img
                                src={trainer.profileImage ? getImageUrl(trainer.profileImage) : fallbackTrainers[0].profileImage}
                                alt={trainer.name}
                                className="w-40 h-40 mx-auto rounded-full object-cover mb-4 border-4 border-orange-500"
                                onError={(e) => {
                                    e.target.src = 'https://res.cloudinary.com/deoegf9on/image/upload/v1748371452/1000155185_wkpz7i.jpg';
                                }}
                            />
                            <h3 className="text-xl font-semibold text-gray-900">{trainer.name}</h3>
                            <p className="text-orange-600 font-medium">{trainer.specialty}</p>
                            <p className="mt-3 text-gray-600 text-sm">{trainer.bio}</p>
                            
                            <div className="mt-6 flex justify-center space-x-4">
                                {trainer.socialMedia?.instagram && (
                                    <a 
                                        href={trainer.socialMedia.instagram} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                        aria-label={`${trainer.name}'s Instagram`}
                                    >
                                        <FaInstagram className="text-xl" />
                                    </a>
                                )}
                                {trainer.socialMedia?.facebook && (
                                    <a 
                                        href={trainer.socialMedia.facebook} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                        aria-label={`${trainer.name}'s Facebook`}
                                    >
                                        <FaFacebook className="text-xl" />
                                    </a>
                                )}
                                {trainer.socialMedia?.twitter && (
                                    <a 
                                        href={trainer.socialMedia.twitter} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-400 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                        aria-label={`${trainer.name}'s Twitter`}
                                    >
                                        <FaTwitter className="text-xl" />
                                    </a>
                                )}
                                {trainer.socialMedia?.linkedin && (
                                    <a 
                                        href={trainer.socialMedia.linkedin} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                        aria-label={`${trainer.name}'s LinkedIn`}
                                    >
                                        <FaLinkedin className="text-xl" />
                                    </a>
                                )}
                                {trainer.phone && (
                                    <a 
                                        href={`https://wa.me/${trainer.phone.replace(/\+/g, '')}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                        aria-label={`WhatsApp ${trainer.name}`}
                                    >
                                        <FaWhatsapp className="text-xl" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default TrainerProfiles;