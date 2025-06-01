import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedLayout from '../feed/components/FeedLayout';
import { FaWeight, FaRuler, FaCalendarAlt, FaChartLine, FaPlus, FaCheck, FaTimes, FaRunning, FaHeartbeat, FaDumbbell } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ENDPOINTS } from '../config';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Mock workout data
const workoutHistory = [
  { id: 1, date: '2023-06-01', type: 'Cardio', duration: 45, calories: 320, notes: 'Morning run, felt great!' },
  { id: 2, date: '2023-06-03', type: 'Strength', duration: 60, calories: 400, notes: 'Upper body focus' },
  { id: 3, date: '2023-06-05', type: 'Flexibility', duration: 30, calories: 150, notes: 'Yoga session' },
  { id: 4, date: '2023-06-08', type: 'Cardio', duration: 50, calories: 380, notes: 'HIIT workout' },
  { id: 5, date: '2023-06-10', type: 'Strength', duration: 55, calories: 420, notes: 'Lower body focus' },
  { id: 6, date: '2023-06-12', type: 'Cardio', duration: 40, calories: 300, notes: 'Evening jog' },
  { id: 7, date: '2023-06-15', type: 'Strength', duration: 65, calories: 450, notes: 'Full body workout' },
  { id: 8, date: '2023-06-18', type: 'Flexibility', duration: 35, calories: 180, notes: 'Stretching session' },
  { id: 9, date: '2023-06-20', type: 'Cardio', duration: 55, calories: 410, notes: 'Spin class' },
  { id: 10, date: '2023-06-23', type: 'Strength', duration: 70, calories: 480, notes: 'Personal best on bench press!' },
  { id: 11, date: '2023-06-25', type: 'Cardio', duration: 60, calories: 440, notes: 'Long run' },
  { id: 12, date: '2023-06-28', type: 'Flexibility', duration: 40, calories: 200, notes: 'Yoga and meditation' },
];

const Progress = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);
  const [showAddWeightModal, setShowAddWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    type: 'Cardio',
    duration: '',
    calories: '',
    notes: ''
  });
  const [activeTab, setActiveTab] = useState('weight');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(ENDPOINTS.USER_PROFILE, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData);
        
        // Set weight history from user data or use mock data
        if (userData.weightHistory && userData.weightHistory.length > 0) {
          setWeightHistory(userData.weightHistory);
        } else {
          // Mock weight history if none exists
          const mockWeightHistory = [
            { date: '2023-05-01', weight: 75 },
            { date: '2023-05-15', weight: 74.5 },
            { date: '2023-06-01', weight: 73.8 },
            { date: '2023-06-15', weight: 73.2 },
            { date: '2023-07-01', weight: 72.5 },
            { date: '2023-07-15', weight: 72.0 },
            { date: '2023-08-01', weight: 71.5 },
          ];
          setWeightHistory(mockWeightHistory);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleAddWeight = () => {
    if (!newWeight || isNaN(newWeight) || parseFloat(newWeight) <= 0) {
      alert('Please enter a valid weight');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      date: today,
      weight: parseFloat(newWeight)
    };

    setWeightHistory([...weightHistory, newEntry].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setNewWeight('');
    setShowAddWeightModal(false);
  };

  const handleAddWorkout = () => {
    if (!newWorkout.duration || !newWorkout.calories) {
      alert('Please fill in all required fields');
      return;
    }

    // In a real app, this would send data to the backend
    setShowAddWorkoutModal(false);
    
    // Reset form
    setNewWorkout({
      type: 'Cardio',
      duration: '',
      calories: '',
      notes: ''
    });
  };

  // Prepare data for weight chart
  const weightChartData = {
    labels: weightHistory.map(entry => {
      const date = new Date(entry.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Weight (kg)',
        data: weightHistory.map(entry => entry.weight),
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: 'rgba(234, 88, 12, 0.5)',
        tension: 0.3
      }
    ]
  };

  // Prepare data for workout chart
  const workoutChartData = {
    labels: workoutHistory.slice(-7).map(entry => {
      const date = new Date(entry.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Duration (min)',
        data: workoutHistory.slice(-7).map(entry => entry.duration),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y',
        tension: 0.3
      },
      {
        label: 'Calories Burned',
        data: workoutHistory.slice(-7).map(entry => entry.calories),
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: 'rgba(234, 88, 12, 0.5)',
        yAxisID: 'y1',
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: activeTab === 'weight' ? 'Weight Progress' : 'Workout Progress',
      },
    },
    scales: activeTab === 'weight' ? {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Weight (kg)'
        }
      }
    } : {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Duration (min)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Calories'
        }
      },
    }
  };

  // Calculate stats
  const calculateWeightChange = () => {
    if (weightHistory.length < 2) return { value: 0, isPositive: false };
    
    const latest = weightHistory[weightHistory.length - 1].weight;
    const earliest = weightHistory[0].weight;
    const change = latest - earliest;
    
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0
    };
  };

  const calculateTotalWorkouts = () => {
    return workoutHistory.length;
  };

  const calculateTotalCalories = () => {
    return workoutHistory.reduce((total, workout) => total + workout.calories, 0);
  };

  const calculateAverageDuration = () => {
    if (workoutHistory.length === 0) return 0;
    const total = workoutHistory.reduce((sum, workout) => sum + workout.duration, 0);
    return (total / workoutHistory.length).toFixed(1);
  };

  const weightChange = calculateWeightChange();
  const totalWorkouts = calculateTotalWorkouts();
  const totalCalories = calculateTotalCalories();
  const averageDuration = calculateAverageDuration();

  if (loading) {
    return (
      <FeedLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </FeedLayout>
    );
  }

  if (error) {
    return (
      <FeedLayout>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </FeedLayout>
    );
  }

  return (
    <FeedLayout>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Progress Tracking</h1>
        <p className="text-gray-600 mb-6">
          Monitor your fitness journey with detailed progress tracking. Track your weight changes, workout history, and more.
        </p>
        
        {/* User Profile Summary - Using the previously unused icons */}
        {user && (
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Profile Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <FaRuler className="text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Height</p>
                  <p className="font-medium">{user.height ? `${user.height} cm` : 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FaChartLine className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fitness Goal</p>
                  <p className="font-medium">{user.fitnessGoal || 'Not set'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Weight</p>
                <p className="text-2xl font-bold text-gray-800">
                  {weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0} kg
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FaWeight className="text-orange-500 text-xl" />
              </div>
            </div>
            <div className="mt-2 text-sm">
              <span className={`font-medium ${weightChange.isPositive ? 'text-red-500' : 'text-green-500'}`}>
                {weightChange.isPositive ? '+' : '-'}{weightChange.value} kg
              </span>
              <span className="text-gray-500 ml-1">since start</span>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Workouts</p>
                <p className="text-2xl font-bold text-gray-800">{totalWorkouts}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaRunning className="text-blue-500 text-xl" />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Across all workout types
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Calories Burned</p>
                <p className="text-2xl font-bold text-gray-800">{totalCalories}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaHeartbeat className="text-green-500 text-xl" />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Estimated from all workouts
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Workout Duration</p>
                <p className="text-2xl font-bold text-gray-800">{averageDuration} min</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaDumbbell className="text-purple-500 text-xl" />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Per workout session
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('weight')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'weight'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaWeight className="inline mr-2" />
              Weight Tracking
            </button>
            <button
              onClick={() => setActiveTab('workouts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'workouts'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaRunning className="inline mr-2" />
              Workout History
            </button>
          </nav>
        </div>
        
        {/* Weight Tracking Tab */}
        {activeTab === 'weight' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Weight Progress</h2>
              <button
                onClick={() => setShowAddWeightModal(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Weight Entry
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <Line data={weightChartData} options={chartOptions} />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Weight History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {weightHistory.slice().reverse().map((entry, index, arr) => {
                    const prevEntry = index < arr.length - 1 ? arr[index + 1] : null;
                    const change = prevEntry ? (entry.weight - prevEntry.weight).toFixed(1) : 0;
                    const changeClass = change > 0 ? 'text-red-500' : change < 0 ? 'text-green-500' : 'text-gray-500';
                    
                    return (
                      <tr key={entry.date} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-gray-400 mr-2" />
                            <span>{new Date(entry.date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{entry.weight} kg</td>
                        <td className="py-3 px-4">
                          {prevEntry ? (
                            <span className={changeClass}>
                              {change > 0 ? '+' : ''}{change} kg
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Workout History Tab */}
        {activeTab === 'workouts' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Workout Progress</h2>
              <button
                onClick={() => setShowAddWorkoutModal(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center"
              >
                <FaPlus className="mr-2" />
                Log Workout
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <Line data={workoutChartData} options={chartOptions} />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Workouts</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calories</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {workoutHistory.slice().reverse().map(workout => (
                    <tr key={workout.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-gray-400 mr-2" />
                          <span>{new Date(workout.date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          workout.type === 'Cardio' ? 'bg-blue-100 text-blue-800' :
                          workout.type === 'Strength' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {workout.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{workout.duration} min</td>
                      <td className="py-3 px-4 font-medium">{workout.calories} cal</td>
                      <td className="py-3 px-4 text-gray-500 truncate max-w-xs">{workout.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Add Weight Modal */}
      {showAddWeightModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">Add Weight Entry</h2>
                <button onClick={() => setShowAddWeightModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="weight">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your current weight"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowAddWeightModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddWeight}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  <FaCheck className="inline mr-1" />
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Workout Modal */}
      {showAddWorkoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">Log Workout</h2>
                <button onClick={() => setShowAddWorkoutModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Workout Type
                </label>
                <select
                  value={newWorkout.type}
                  onChange={(e) => setNewWorkout({...newWorkout, type: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Cardio">Cardio</option>
                  <option value="Strength">Strength</option>
                  <option value="Flexibility">Flexibility</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={newWorkout.duration}
                  onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter workout duration"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Calories Burned
                </label>
                <input
                  type="number"
                  value={newWorkout.calories}
                  onChange={(e) => setNewWorkout({...newWorkout, calories: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Estimated calories burned"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Notes
                </label>
                <textarea
                  value={newWorkout.notes}
                  onChange={(e) => setNewWorkout({...newWorkout, notes: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Optional notes about your workout"
                  rows="3"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowAddWorkoutModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddWorkout}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  <FaCheck className="inline mr-1" />
                  Save Workout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </FeedLayout>
  );
};

export default Progress;