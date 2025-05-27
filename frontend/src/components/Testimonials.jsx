import React from 'react';
import { FaStar } from 'react-icons/fa';

const testimonials = [
    {
        name: 'Garima Keshwani',
        review: 'Perfect place to achieve your fitness goals and maintain your physique. The instructors are so co-operative & humble and totally dedicated towards their students. Best Zumba & Yoga class in Ujjain must join it.',
        rating: 5,
    },
    {
        name: 'Ishita Mehta',
        review: 'Best, fun and most engaging Zumba class 💥💪🏻 I lost 10kgs in a span of 3-4 months. With zumba they provide Fitness & Yoga classes as well. Best place for Fitness, Zumba & Yoga in Ujjain. 🤸🏻‍♀️',
        rating: 5,
    },
    {
        name: 'Madhuri Chouhan',
        review: 'Hands down, best choice I have made joining fly fitness zone. Super fun class, great music, great moves and of course fab instructors who really got us into it. They guide us with full interest no matter what fitness level we are at. They give us tips and tricks to get the most out of every workout. It is also fun doing different types of routines set by them. I recommended it to anyone who would like to improve their fitness and health. ✨️',
        rating: 5,
    },
    {
        name: 'Kunjala Shah',
        review: 'Did not had one to one experience but online sessions are just fabulous. The trainers are more dedicated towards students and they make sure that the sessions are interactive. I would personally recommend FFZ if anyone is looking for online Yoga/Zumba. 💪🏻',
        rating: 5,
    },
    {
        name: 'Manasvi Rathore',
        review: 'The best zumba class in ujjain 🫶 best place to workout with best trainers knowledgeable and experienced.this atmosphere is great and really helps me focus on my workouts.This is amazing place to workout thanks to best instructor for ritesh sir aadi sir❤️✨',
        rating: 5,
    },
    {
        name: 'Rupal Rochwani',
        review: 'Best place in ujjain to workout ! They provide best advice and create an atmosphere full of energy using different  are creative workout , outdoor sessions and specially zumba which is my personal favourite! I would personally recommend to all for more fun during workout and get yourself refreshed from your hectic schedule 🫡🫡',
        rating: 5,
    },
];

const googleMapsReviewsLink = "https://www.google.com/maps/place/Fly+fitness+zone/@23.1797753,75.7758373,17z/data=!4m8!3m7!1s0x396375bf09c0b283:0xe019322e56ba7e12!8m2!3d23.1797753!4d75.7784122!9m1!1b1!16s%2Fg%2F11hzysp26_?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D";

const Testimonials = () => {
    return (
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-900">What Our Members Say</h2>
                <p className="mt-4 text-gray-600">Real stories from real people achieving real results.</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto mb-12">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className="bg-gray-50 border border-gray-200 rounded-lg shadow p-6 text-left hover:shadow-lg transition duration-300"
                    >
                        <div className="flex items-center mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <FaStar key={i} className="text-yellow-400 mr-1" />
                            ))}
                        </div>
                        <p className="text-gray-700 mb-4 italic">"{testimonial.review}"</p>
                        <h4 className="text-orange-600 font-semibold">{testimonial.name}</h4>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <a
                    href={googleMapsReviewsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-md transition duration-300"
                >
                    See All Reviews on Google Maps
                </a>
            </div>
        </section>
    );
};

export default Testimonials;
