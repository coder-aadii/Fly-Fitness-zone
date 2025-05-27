import React from 'react';

const AboutUs = () => {
    return (
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8" id='about'>
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                {/* Video/Image section */}
                <div className="w-full aspect-[1/1]">
                    <img
                        src="https://res.cloudinary.com/deoegf9on/image/upload/v1748371094/wmremove-transformed_2_pdnl5u.jpg"
                        alt="Fly Fitness"
                        className="rounded-lg shadow-lg w-full h-full object-cover"
                    />
                </div>

                {/* Text section */}
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">About Us</h2>
                    <p className="text-gray-700 mb-4">
                        At <strong>Fly Fitness Zone</strong>, we believe that fitness is not a luxury—it's a necessity for a better quality of life. Our mission is to inspire individuals from all walks of life to take charge of their health and well-being. Staying fit not only enhances your physical appearance but also boosts mental clarity, emotional balance, and long-term financial savings by reducing medical expenses and dependency.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Our facility is more than just a gym—it's a supportive community. We offer a rich variety of workout formats to meet the unique needs of each individual, including <strong>Zumba, Yoga, Tabata, Cardio, Weight Training, Bodyweight Workouts, Power Yoga, Meditation, and YogNidra</strong>. These sessions are designed to build strength, flexibility, endurance, and inner peace.
                    </p>
                    <p className="text-gray-700 mb-4">
                        What sets us apart is our commitment to personal attention. Unlike most fitness centers, <strong>we provide one-on-one guidance within our regular class fees</strong>, so you receive professional support without any hidden charges or extra cost for personal training. Whether you’re a beginner or a seasoned enthusiast, Fly Fitness Zone is your destination for a healthier, empowered life.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
