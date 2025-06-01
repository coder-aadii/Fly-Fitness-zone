import React, { useState } from 'react';
import FeedLayout from '../feed/components/FeedLayout';
import { FaDumbbell, FaRunning, FaSwimmer, FaHeartbeat, FaFilter, FaSearch } from 'react-icons/fa';

const workoutData = [
  {
    id: 1,
    title: 'Full Body Strength',
    category: 'Strength',
    duration: '45 min',
    difficulty: 'Intermediate',
    description: 'A complete workout targeting all major muscle groups with compound exercises.',
    instructor: 'John Davis',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 2,
    title: 'HIIT Cardio Blast',
    category: 'Cardio',
    duration: '30 min',
    difficulty: 'Advanced',
    description: 'High-intensity interval training to maximize calorie burn and improve cardiovascular health.',
    instructor: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 3,
    title: 'Yoga Flow',
    category: 'Flexibility',
    duration: '60 min',
    difficulty: 'Beginner',
    description: 'Gentle yoga sequence focusing on flexibility, balance, and mindfulness.',
    instructor: 'Maya Patel',
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 4,
    title: 'Core Crusher',
    category: 'Strength',
    duration: '20 min',
    difficulty: 'Intermediate',
    description: 'Targeted core workout to build abdominal strength and improve posture.',
    instructor: 'Mike Wilson',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 5,
    title: 'Beginner Weight Training',
    category: 'Strength',
    duration: '40 min',
    difficulty: 'Beginner',
    description: 'Introduction to weight training with proper form and technique guidance.',
    instructor: 'Lisa Thompson',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 6,
    title: 'Spin Class',
    category: 'Cardio',
    duration: '45 min',
    difficulty: 'Intermediate',
    description: 'Indoor cycling workout with intervals, hills, and sprints for a full cardio challenge.',
    instructor: 'David Kim',
    image: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

const Workouts = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const filteredWorkouts = workoutData.filter(workout => {
    const matchesFilter = filter === 'All' || workout.category === filter;
    const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         workout.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout);
  };

  const closeModal = () => {
    setSelectedWorkout(null);
  };

  return (
    <FeedLayout>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Workout Library</h1>
        <p className="text-gray-600 mb-6">
          Browse our collection of workouts designed by professional trainers. Filter by category or search for specific workouts.
        </p>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilter('All')} 
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === 'All' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('Strength')} 
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                filter === 'Strength' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaDumbbell className="mr-1" /> Strength
            </button>
            <button 
              onClick={() => setFilter('Cardio')} 
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                filter === 'Cardio' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaRunning className="mr-1" /> Cardio
            </button>
            <button 
              onClick={() => setFilter('Flexibility')} 
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                filter === 'Flexibility' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaSwimmer className="mr-1" /> Flexibility
            </button>
          </div>
          
          <div className="flex space-x-2">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search workouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            {/* Advanced Filter Button - Using previously unused FaFilter icon */}
            <button
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              title="Advanced Filters"
            >
              <FaFilter className="mr-2" />
              <span className="hidden md:inline">Advanced Filters</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map(workout => (
            <div 
              key={workout.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleWorkoutClick(workout)}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={workout.image} 
                  alt={workout.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{workout.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    workout.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    workout.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {workout.difficulty}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FaHeartbeat className="mr-1" />
                  <span>{workout.category}</span>
                  <span className="mx-2">•</span>
                  <span>{workout.duration}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{workout.description}</p>
                <p className="text-xs text-gray-500 mt-2">Instructor: {workout.instructor}</p>
              </div>
            </div>
          ))}
        </div>
        
        {filteredWorkouts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No workouts found matching your criteria.</p>
            <button 
              onClick={() => {setFilter('All'); setSearchTerm('');}} 
              className="mt-2 text-orange-500 hover:text-orange-600"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      
      {/* Workout Detail Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="h-64 overflow-hidden">
              <img 
                src={selectedWorkout.image} 
                alt={selectedWorkout.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedWorkout.title}</h2>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedWorkout.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                  selectedWorkout.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedWorkout.difficulty}
                </span>
              </div>
              
              <div className="flex items-center text-gray-500 mb-4">
                <FaHeartbeat className="mr-1" />
                <span>{selectedWorkout.category}</span>
                <span className="mx-2">•</span>
                <span>{selectedWorkout.duration}</span>
                <span className="mx-2">•</span>
                <span>Instructor: {selectedWorkout.instructor}</span>
              </div>
              
              <p className="text-gray-600 mb-6">{selectedWorkout.description}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">What You'll Need</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Comfortable workout clothes</li>
                  <li>Water bottle</li>
                  <li>Towel</li>
                  {selectedWorkout.category === 'Strength' && (
                    <>
                      <li>Dumbbells or resistance bands</li>
                      <li>Exercise mat</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                  Start Workout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </FeedLayout>
  );
};

export default Workouts;