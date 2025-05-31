import React from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const trainers = [
    {
        name: 'Ritesh Sontani',
        title: 'Certified Zumba Instructor',
        image: 'https://res.cloudinary.com/deoegf9on/image/upload/v1748371451/Screenshot_2025_0528_001220_q10mk2.jpg',
        bio: 'Ritesh brings energy and passion to every Zumba class. With years of experience and official certification, he ensures every session feels like a party while helping you burn calories and build stamina.',
        instagram: 'https://www.instagram.com/ritesh_sontani?igsh=MWtidWM4ZmQyM3VsNA==',
        phone: '+919406681919'
    },
    {
        name: 'Aditya Aerpule',
        title: 'Certified Yoga Instructor',
        image: 'https://res.cloudinary.com/deoegf9on/image/upload/v1748371452/1000155185_wkpz7i.jpg',
        bio: 'Aditya blends traditional yoga with modern fitness techniques. His expertise in Yoga, Meditation, and YogNidra helps students improve flexibility, reduce stress, and gain inner peace.',
        instagram: 'https://www.instagram.com/mr_aadi.insane?igsh=cTVoNXF6Zm13eThi',
        phone: '+919074703157'
    },
    {
        name: 'Jigyasa Bhatia',
        title: 'Certified Zumba Instructor',
        image: 'https://res.cloudinary.com/deoegf9on/image/upload/v1748371451/Screenshot_2025_0528_001305_c746xc.jpg',
        bio: "With her vibrant energy and rhythmic finesse, Jigyasa creates an uplifting environment in every class. She's dedicated to making fitness fun and accessible for all.",
        instagram: 'https://www.instagram.com/jigyasabhatia?igsh=bWJ4bzY3aHlicTUy',
        phone: '+919179717777'
    },
];

const TrainerProfiles = () => {
    return (
        <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8" id='trainers'>
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-900">Meet Our Trainers</h2>
                <p className="mt-4 text-gray-600">
                    Our experienced and certified trainers are here to guide you every step of the way in your fitness journey.
                </p>
            </div>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                {trainers.map((trainer, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden text-center p-6">
                        <img
                            src={trainer.image}
                            alt={trainer.name}
                            className="w-40 h-40 mx-auto rounded-full object-cover mb-4 border-4 border-orange-500"
                        />
                        <h3 className="text-xl font-semibold text-gray-900">{trainer.name}</h3>
                        <p className="text-orange-600 font-medium">{trainer.title}</p>
                        <p className="mt-3 text-gray-600 text-sm">{trainer.bio}</p>
                        
                        <div className="mt-6 flex justify-center space-x-6">
                            <a 
                                href={trainer.instagram} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                aria-label={`${trainer.name}'s Instagram`}
                            >
                                <FaInstagram className="text-2xl" />
                            </a>
                            <a 
                                href={`https://wa.me/${trainer.phone.replace(/\+/g, '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                aria-label={`WhatsApp ${trainer.name}`}
                            >
                                <FaWhatsapp className="text-2xl" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TrainerProfiles;