import React, { useState } from 'react';
import FeedLayout from '../feed/components/FeedLayout';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaDumbbell, FaSignal } from 'react-icons/fa';

// Real class schedule data based on ClassesOverview component
const initialClasses = [
  {
    id: 1,
    title: 'Zumba + Fitness',
    day: 'Monday',
    time: '6:00 AM – 7:00 AM',
    instructor: 'Ritesh Sontani',
    location: 'Zumba Hall',
    capacity: 20,
    enrolled: 15,
    description: 'Dance your way to fitness with this high-energy Zumba class combined with strength training elements.',
    level: 'All Levels'
  },
  {
    id: 2,
    title: 'Yoga + Fitness',
    day: 'Monday',
    time: '7:00 AM – 8:00 AM',
    instructor: 'Aditya Aerpule',
    location: 'Yoga Hall',
    capacity: 15,
    enrolled: 12,
    description: 'A balanced combination of yoga flows and fitness exercises to improve flexibility and strength.',
    level: 'Beginner'
  },
  {
    id: 3,
    title: 'Tabata',
    day: 'Monday',
    time: '8:00 AM – 9:00 AM',
    instructor: 'Jigyasa Bhatia',
    location: 'Zumba Hall',
    capacity: 12,
    enrolled: 10,
    description: 'High-intensity interval training with 20 seconds of intense exercise followed by 10 seconds of rest.',
    level: 'Intermediate'
  },
  {
    id: 4,
    title: 'Cardio Blast',
    day: 'Monday',
    time: '5:00 PM – 6:00 PM',
    instructor: 'Ritesh Sontani',
    location: 'Zumba Hall',
    capacity: 18,
    enrolled: 16,
    description: 'High-energy cardio workout designed to boost your heart rate and burn calories.',
    level: 'All Levels'
  },
  {
    id: 5,
    title: 'Weight Training',
    day: 'Monday',
    time: '6:00 PM – 7:00 PM',
    instructor: 'Aditya Aerpule',
    location: 'Yoga Hall',
    capacity: 15,
    enrolled: 13,
    description: 'Focused weight training session to build strength and muscle definition.',
    level: 'Intermediate'
  },
  {
    id: 6,
    title: 'Power Yoga',
    day: 'Tuesday',
    time: '6:00 AM – 7:00 AM',
    instructor: 'Aditya Aerpule',
    location: 'Yoga Hall',
    capacity: 15,
    enrolled: 12,
    description: 'Vigorous, fitness-based approach to vinyasa-style yoga with emphasis on strength and flexibility.',
    level: 'Intermediate'
  },
  {
    id: 7,
    title: 'HIIT Circuit',
    day: 'Tuesday',
    time: '7:00 AM – 8:00 AM',
    instructor: 'Jigyasa Bhatia',
    location: 'Zumba Hall',
    capacity: 12,
    enrolled: 10,
    description: 'High-intensity interval training with circuit-style exercises to maximize calorie burn.',
    level: 'Advanced'
  },
  {
    id: 8,
    title: 'Meditation',
    day: 'Tuesday',
    time: '8:00 AM – 9:00 AM',
    instructor: 'Aditya Aerpule',
    location: 'Yoga Hall',
    capacity: 20,
    enrolled: 15,
    description: 'Guided meditation session to reduce stress and improve mental clarity.',
    level: 'All Levels'
  },
  {
    id: 9,
    title: 'Zumba',
    day: 'Tuesday',
    time: '5:00 PM – 6:00 PM',
    instructor: 'Ritesh Sontani',
    location: 'Zumba Hall',
    capacity: 25,
    enrolled: 22,
    description: 'Dance-based fitness class featuring Latin and international music and movements.',
    level: 'All Levels'
  },
  {
    id: 10,
    title: 'Core Conditioning',
    day: 'Tuesday',
    time: '6:00 PM – 7:00 PM',
    instructor: 'Jigyasa Bhatia',
    location: 'Zumba Hall',
    capacity: 20,
    enrolled: 15,
    description: 'Focused core workout to strengthen abdominal muscles and improve posture.',
    level: 'All Levels'
  },
  {
    id: 11,
    title: 'Yoga + Fitness',
    day: 'Wednesday',
    time: '6:00 AM – 7:00 AM',
    instructor: 'Aditya Aerpule',
    location: 'Yoga Hall',
    capacity: 15,
    enrolled: 12,
    description: 'A balanced combination of yoga flows and fitness exercises to improve flexibility and strength.',
    level: 'Beginner'
  },
  {
    id: 12,
    title: 'Tabata',
    day: 'Wednesday',
    time: '7:00 AM – 8:00 AM',
    instructor: 'Jigyasa Bhatia',
    location: 'Zumba Hall',
    capacity: 12,
    enrolled: 10,
    description: 'High-intensity interval training with 20 seconds of intense exercise followed by 10 seconds of rest.',
    level: 'Intermediate'
  },
  {
    id: 13,
    title: 'Zumba + Fitness',
    day: 'Wednesday',
    time: '8:00 AM – 9:00 AM',
    instructor: 'Ritesh Sontani',
    location: 'Zumba Hall',
    capacity: 20,
    enrolled: 18,
    description: 'Dance your way to fitness with this high-energy Zumba class combined with strength training elements.',
    level: 'All Levels'
  },
  {
    id: 14,
    title: 'Weight Training',
    day: 'Wednesday',
    time: '5:00 PM – 6:00 PM',
    instructor: 'Aditya Aerpule',
    location: 'Yoga Hall',
    capacity: 15,
    enrolled: 13,
    description: 'Focused weight training session to build strength and muscle definition.',
    level: 'Intermediate'
  },
  {
    id: 15,
    title: 'Cardio Blast',
    day: 'Wednesday',
    time: '6:00 PM – 7:00 PM',
    instructor: 'Jigyasa Bhatia',
    location: 'Zumba Hall',
    capacity: 18,
    enrolled: 16,
    description: 'High-energy cardio workout designed to boost your heart rate and burn calories.',
    level: 'All Levels'
  },
  {
    id: 16,
    title: 'Meditation',
    day: 'Thursday',
    time: '6:00 AM – 7:00 AM',
    instructor: 'Aditya Aerpule',
    location: 'Yoga Hall',
    capacity: 20,
    enrolled: 15,
    description: 'Guided meditation session to reduce stress and improve mental clarity.',
    level: 'All Levels'
  },
  {
    id: 17,
    title: 'HIIT Circuit',
    day: 'Thursday',
    time: '7:00 AM – 8:00 AM',
    instructor: 'Jigyasa Bhatia',
    location: 'Zumba Hall',
    capacity: 12,
    enrolled: 10,
    description: 'High-intensity interval training with circuit-style exercises to maximize calorie burn.',
    level: 'Advanced'
  },
  {
    id: 18,
    title: 'Power Yoga',
    day: 'Thursday',
    time: '8:00 AM – 9:00 AM',
    instructor: 'Aditya Aerpule',
    location: 'Yoga Hall',
    capacity: 15,
    enrolled: 12,
    description: 'Vigorous, fitness-based approach to vinyasa-style yoga with emphasis on strength and flexibility.',
    level: 'Intermediate'
  },
  {
    id: 19,
    title: 'Core Conditioning',
    day: 'Thursday',
    time: '5:00 PM – 6:00 PM',
    instructor: 'Jigyasa Bhatia',
    location: 'Zumba Hall',
    capacity: 20,
    enrolled: 15,
    description: 'Focused core workout to strengthen abdominal muscles and improve posture.',
    level: 'All Levels'
  },
  {
    id: 20,
    title: 'Zumba',
    day: 'Thursday',
    time: '6:00 PM – 7:00 PM',
    instructor: 'Ritesh Sontani',
    location: 'Zumba Hall',
    capacity: 25,
    enrolled: 22,
    description: 'Dance-based fitness class featuring Latin and international music and movements.',
    level: 'All Levels'
  },
  {
    id: 21,
    title: 'Tabata',
    day: 'Friday',
    time: '6:00 AM – 7:00 AM',
    instructor: 'Jigyasa Bhatia',
    location: 'Zumba Hall',
    capacity: 12,
    enrolled: 10,
    description: 'High-intensity interval training with 20 seconds of intense exercise followed by 10 seconds of rest.',
    level: 'Intermediate'
  },
  {
    id: 22,
    title: 'Yoga + Fitness',
    day: 'Friday',
    time: '7:00 AM – 8:00 AM',
    instructor: 'Aditya Aerpule',
    location: 'Yoga Hall',
    capacity: 15,
    enrolled: 12,
    description: 'A balanced combination of yoga flows and fitness exercises to improve flexibility and strength.',
    level: 'Beginner'
  },
  {
    id: 23,
    title: 'Zumba + Fitness',
    day: 'Friday',
    time: '8:00 AM – 9:00 AM',
    instructor: 'Ritesh Sontani',
    location: 'Zumba Hall',
    capacity: 20,
    enrolled: 18,
    description: 'Dance your way to fitness with this high-energy Zumba class combined with strength training elements.',
    level: 'All Levels'
  },
  {
    id: 24,
    title: 'Cardio Blast',
    day: 'Friday',
    time: '5:00 PM – 6:00 PM',
    instructor: 'Jigyasa Bhatia',
    location: 'Zumba Hall',
    capacity: 18,
    enrolled: 16,
    description: 'High-energy cardio workout designed to boost your heart rate and burn calories.',
    level: 'All Levels'
  },
  {
    id: 25,
    title: 'Weight Training',
    day: 'Friday',
    time: '6:00 PM – 7:00 PM',
    instructor: 'Aditya Aerpule',
    location: 'Yoga Hall',
    capacity: 15,
    enrolled: 13,
    description: 'Focused weight training session to build strength and muscle definition.',
    level: 'Intermediate'
  },
  {
    id: 26,
    title: 'Weekend Warrior',
    day: 'Saturday',
    time: '7:00 AM – 8:00 AM',
    instructor: 'Jigyasa Bhatia',
    location: 'Zumba Hall',
    capacity: 20,
    enrolled: 18,
    description: 'High-energy class combining strength and cardio for a challenging weekend workout.',
    level: 'All Levels'
  },
  {
    id: 27,
    title: 'Yoga Flow',
    day: 'Saturday',
    time: '8:00 AM – 9:00 AM',
    instructor: 'Aditya Aerpule',
    location: 'Yoga Hall',
    capacity: 15,
    enrolled: 12,
    description: 'Flowing yoga sequences to improve flexibility, balance, and mindfulness.',
    level: 'All Levels'
  },
  {
    id: 28,
    title: 'Gentle Yoga',
    day: 'Sunday',
    time: '8:00 AM – 9:00 AM',
    instructor: 'Aditya Aerpule',
    location: 'Yoga Hall',
    capacity: 15,
    enrolled: 10,
    description: 'Relaxing yoga session focusing on gentle stretches and mindfulness to end your week.',
    level: 'Beginner'
  }
];

// Days of the week for filtering
const daysOfWeek = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState('All');
  const [myClasses, setMyClasses] = useState([2, 5, 9]); // IDs of classes the user is enrolled in
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  
  // Filter classes based on selected day
  const filteredClasses = selectedDay === 'All' 
    ? initialClasses 
    : initialClasses.filter(cls => cls.day === selectedDay);

  const handleEnroll = (classId) => {
    if (myClasses.includes(classId)) {
      setMyClasses(myClasses.filter(id => id !== classId));
    } else {
      setMyClasses([...myClasses, classId]);
    }
  };

  const openClassDetails = (classItem) => {
    setSelectedClass(classItem);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  return (
    <FeedLayout>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Class Schedule</h1>
        <p className="text-gray-600 mb-6">
          Browse and enroll in our fitness classes. Filter by day to find the perfect class for your schedule.
        </p>
        
        {/* Admin Actions section removed as these functions are available elsewhere */}
        
        {/* Day filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {daysOfWeek.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedDay === day 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        
        {/* My Classes section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Enrolled Classes</h2>
          {myClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {initialClasses
                .filter(cls => myClasses.includes(cls.id))
                .map(cls => (
                  <div 
                    key={cls.id} 
                    className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openClassDetails(cls)}
                  >
                    <h3 className="font-semibold text-lg text-orange-700">{cls.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <FaCalendarAlt className="mr-1" />
                      <span>{cls.day}</span>
                      <span className="mx-2">•</span>
                      <FaClock className="mr-1" />
                      <span>{cls.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <FaUser className="mr-1" />
                      <span>{cls.instructor}</span>
                      <span className="mx-2">•</span>
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{cls.location}</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">You are not enrolled in any classes yet.</p>
          )}
        </div>
        
        {/* All Classes section */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Classes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day & Time</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClasses.map(cls => (
                <tr 
                  key={cls.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openClassDetails(cls)}
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">
                      {cls.title}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-1" />
                      <span>{cls.day}</span>
                      <span className="mx-1">•</span>
                      <FaClock className="text-gray-400 mr-1" />
                      <span>{cls.time}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-1" />
                      <span>{cls.instructor}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-400 mr-1" />
                      <span>{cls.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className={`text-sm ${
                        cls.enrolled >= cls.capacity 
                          ? 'text-red-600' 
                          : cls.enrolled >= cls.capacity * 0.8 
                          ? 'text-yellow-600' 
                          : 'text-green-600'
                      }`}>
                        {cls.enrolled}/{cls.capacity}
                      </span>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            cls.enrolled >= cls.capacity 
                              ? 'bg-red-500' 
                              : cls.enrolled >= cls.capacity * 0.8 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnroll(cls.id);
                      }}
                      disabled={cls.enrolled >= cls.capacity && !myClasses.includes(cls.id)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        myClasses.includes(cls.id)
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : cls.enrolled >= cls.capacity
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {myClasses.includes(cls.id) ? 'Unenroll' : 'Enroll'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredClasses.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No classes scheduled for {selectedDay}.</p>
            <button 
              onClick={() => setSelectedDay('All')} 
              className="mt-2 text-orange-500 hover:text-orange-600"
            >
              View all days
            </button>
          </div>
        )}
      </div>
      
      {/* Class Detail Modal */}
      {showModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedClass.title}</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">{selectedClass.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Schedule Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-orange-500 mr-2" />
                      <span>{selectedClass.day}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="text-orange-500 mr-2" />
                      <span>{selectedClass.time}</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-orange-500 mr-2" />
                      <span>{selectedClass.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Class Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaUser className="text-orange-500 mr-2" />
                      <span>Instructor: {selectedClass.instructor}</span>
                    </div>
                    <div className="flex items-center">
                      <FaSignal className="text-orange-500 mr-2" />
                      <span>Level: {selectedClass.level}</span>
                    </div>
                    <div className="flex items-center">
                      <FaDumbbell className="text-orange-500 mr-2" />
                      <span>Capacity: {selectedClass.enrolled}/{selectedClass.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className={`h-2.5 rounded-full ${
                          selectedClass.enrolled >= selectedClass.capacity 
                            ? 'bg-red-500' 
                            : selectedClass.enrolled >= selectedClass.capacity * 0.8 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${(selectedClass.enrolled / selectedClass.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">What to Bring</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Comfortable workout clothes</li>
                  <li>Water bottle</li>
                  <li>Towel</li>
                  <li>Positive attitude</li>
                </ul>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    handleEnroll(selectedClass.id);
                    closeModal();
                  }}
                  disabled={selectedClass.enrolled >= selectedClass.capacity && !myClasses.includes(selectedClass.id)}
                  className={`px-4 py-2 rounded-lg ${
                    myClasses.includes(selectedClass.id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : selectedClass.enrolled >= selectedClass.capacity
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {myClasses.includes(selectedClass.id) ? 'Unenroll from Class' : 'Enroll in Class'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </FeedLayout>
  );
};

export default Schedule;