// Mock data for the feed
export const mockPosts = [
  {
    _id: '1',
    content: 'Just finished a 5K run in 25 minutes! Personal best! 🏃‍♂️💪 #FitnessGoals #Running',
    media: 'https://res.cloudinary.com/deoegf9on/image/upload/v1748372831/Picsart_25-05-28_00-36-29-353_ztxgo0.jpg',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    user: {
      _id: '101',
      name: 'John Doe',
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    likes: ['102', '103'],
    comments: [
      {
        _id: 'c1',
        text: 'Amazing progress! Keep it up!',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        user: {
          _id: '102',
          name: 'Sarah Johnson',
          profileImage: null
        }
      }
    ]
  },
  {
    _id: '2',
    content: 'New workout routine for building core strength. Who wants to try it with me?',
    media: null,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    user: {
      _id: '102',
      name: 'Sarah Johnson',
      profileImage: null
    },
    likes: ['101'],
    comments: [
      {
        _id: 'c2',
        text: 'I\'m in! What time are you planning to start?',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        user: {
          _id: '101',
          name: 'John Doe',
          profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
        }
      },
      {
        _id: 'c3',
        text: 'Could you share the routine details?',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        user: {
          _id: '103',
          name: 'Mike Wilson',
          profileImage: null
        }
      }
    ]
  },
  {
    _id: '3',
    content: 'Check out my new protein shake recipe! Banana, peanut butter, protein powder, and almond milk. Delicious and nutritious!',
    media: 'https://res.cloudinary.com/deoegf9on/image/upload/v1748372831/Picsart_25-05-28_00-36-29-353_ztxgo0.jpg',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    user: {
      _id: '103',
      name: 'Mike Wilson',
      profileImage: null
    },
    likes: ['101', '102', '104'],
    comments: []
  },
  {
    _id: '4',
    content: 'Today\'s yoga session was so relaxing. Highly recommend taking 30 minutes for yourself each day to center your mind and body.',
    media: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
    user: {
      _id: '104',
      name: 'Emily Chen',
      profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    likes: ['102'],
    comments: [
      {
        _id: 'c4',
        text: 'Which yoga routine did you follow?',
        createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        user: {
          _id: '102',
          name: 'Sarah Johnson',
          profileImage: null
        }
      }
    ]
  },
  {
    _id: '5',
    content: 'Just signed up for the Fly Fitness Zone marathon next month! Anyone else participating?',
    media: null,
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // 30 hours ago
    user: {
      _id: '101',
      name: 'John Doe',
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    likes: ['103', '104'],
    comments: [
      {
        _id: 'c5',
        text: 'I\'ll be there! Let\'s train together.',
        createdAt: new Date(Date.now() - 29 * 60 * 60 * 1000).toISOString(),
        user: {
          _id: '103',
          name: 'Mike Wilson',
          profileImage: null
        }
      }
    ]
  }
];

// Mock current user
export const mockCurrentUser = {
  _id: '101',
  name: 'John Doe',
  email: 'john.doe@example.com',
  profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  role: 'user'
};