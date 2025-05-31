# Fly Fitness Zone

<div align="center">
  <img src="frontend/src/assets/images/logo_img.png" alt="Fly Fitness Zone Logo" width="200"/>
  <h3>A Comprehensive Fitness Management Platform</h3>
  <p>Empowering fitness enthusiasts with a modern, secure, and feature-rich experience</p>
  
  <a href="https://flyfitnesszone.netlify.app" target="_blank">
    <img src="https://img.shields.io/badge/Visit%20Live%20Site-flyfitnesszone.netlify.app-orange?style=for-the-badge&logo=netlify" alt="Live Site" />
  </a>
</div>

---

## Table of Contents

1. [Introduction](#introduction)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Installation & Setup](#installation--setup)
6. [User Roles & Capabilities](#user-roles--capabilities)
7. [Security Features](#security-features)
8. [API Documentation](#api-documentation)
9. [Deployment](#deployment)
10. [Future Enhancements](#future-enhancements)
11. [Contributing](#contributing)
12. [License](#license)
13. [Contact](#contact)

---

## Introduction

**Fly Fitness Zone** is a comprehensive fitness management platform designed to streamline the operations of fitness centers while enhancing the experience for members. The application provides a robust solution for managing memberships, tracking fitness progress, facilitating social interactions, and handling administrative tasks.

Built on the MERN stack (MongoDB, Express.js, React.js, Node.js), the platform offers a responsive and intuitive interface for both users and administrators, with a focus on security, performance, and user experience.

<div align="center">
  <img src="https://res.cloudinary.com/deoegf9on/image/upload/v1748689981/notFound_ok0tpl.gif" alt="Fly Fitness Zone Animation" width="400"/>
</div>

---

## Key Features

### User Authentication & Management
- **Secure Registration & Login**: Email verification with OTP
- **Role-Based Access Control**: Separate interfaces for members and administrators
- **Password Management**: Secure reset functionality with email verification
- **Profile Management**: Comprehensive user profiles with fitness metrics

<div align="center">
  <img src="https://i.ibb.co/Jt8MhQV/authentication.png" alt="Authentication Screenshot" width="700"/>
</div>

### Member Dashboard
- **Personalized Dashboard**: Overview of fitness journey and upcoming activities
- **Progress Tracking**: Weight history, fitness goals, and achievements
- **Payment Management**: View payment history and upcoming dues
- **Settings Management**: Update profile information and preferences

<div align="center">
  <img src="https://i.ibb.co/YXVtszD/dashboard.png" alt="Dashboard Screenshot" width="700"/>
</div>

### Social Feed
- **Community Interaction**: Share fitness achievements and updates
- **Media Sharing**: Support for image uploads in posts
- **Engagement Features**: Like and comment on community posts
- **Temporary Content**: Posts automatically expire after 36 hours

<div align="center">
  <img src="https://i.ibb.co/Qf7s3JN/social-feed.png" alt="Social Feed Screenshot" width="700"/>
</div>

### Administrative Capabilities
- **Member Management**: View and manage all registered members
- **Financial Oversight**: Track payments and dues
- **Content Moderation**: Monitor and manage community posts
- **System Analytics**: Insights into platform usage and member activities

### Fitness Resources
- **Class Information**: Details about available fitness classes
- **Trainer Profiles**: Information about fitness instructors
- **Fitness Offerings**: Overview of gym facilities and services
- **Testimonials**: Success stories from members

<div align="center">
  <img src="https://i.ibb.co/VVbfKnS/fitness-resources.png" alt="Fitness Resources Screenshot" width="700"/>
</div>

### Communication
- **Contact Form**: Direct communication channel with administrators
- **Email Notifications**: Automated alerts for important events
- **Password Reset**: Secure password recovery process

### Error Handling & User Experience
- **Comprehensive Error Pages**: Custom error pages for different scenarios
- **Responsive Design**: Optimized for all device sizes
- **Loading States**: Visual feedback during data fetching operations
- **Form Validation**: Immediate feedback on user inputs

---

## Technology Stack

### Frontend
- **React.js**: UI component library
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **React Icons**: Icon library
- **Lucide React**: Modern icon set

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt.js**: Password hashing
- **Multer**: File upload handling
- **Nodemailer**: Email functionality

### Development & Deployment
- **Git**: Version control
- **ESLint**: Code quality
- **Netlify**: Frontend hosting ([flyfitnesszone.netlify.app](https://flyfitnesszone.netlify.app))
- **Render**: Backend hosting
- **MongoDB Atlas**: Cloud database service

<div align="center">
  <img src="https://i.ibb.co/5GCXjzk/tech-stack.png" alt="Technology Stack" width="700"/>
</div>

---

## Architecture

### System Architecture
The application follows a client-server architecture with a clear separation of concerns:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend │<────>│  Express API    │<────>│  MongoDB        │
│  (Client)       │      │  (Server)       │      │  (Database)     │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Directory Structure

```
Fly-Fitness-Zone/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── config/
│   │   ├── feed/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

## Installation & Setup

### Prerequisites
- Node.js (v14.x or higher)
- MongoDB (local instance or Atlas connection)
- npm or yarn package manager

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Access the application at `http://localhost:3000`

<div align="center">
  <img src="https://i.ibb.co/Lp2Ydkz/setup.png" alt="Setup Process" width="600"/>
</div>

---

## User Roles & Capabilities

### Members
Members can access the following features:
- Personal dashboard with fitness metrics
- Weight tracking and history visualization
- Social feed for community interaction
- Profile management and settings
- Payment history and due dates
- Class information and trainer profiles

### Administrators
Administrators have access to all member features plus:
- Member management dashboard
- Financial oversight and payment tracking
- Content moderation tools
- System analytics and reporting
- Email communication with members
- Platform configuration options

<div align="center">
  <img src="https://i.ibb.co/YBnkSWL/roles.png" alt="User Roles" width="600"/>
</div>

---

## Security Features

### Authentication Security
- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure, token-based authentication
- **Email Verification**: OTP-based email verification for new accounts
- **Session Management**: Automatic session expiration

### Data Protection
- **Input Validation**: Comprehensive validation on all user inputs
- **XSS Protection**: Prevention of cross-site scripting attacks
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: Protection against brute force attacks

### Privacy Considerations
- **Data Minimization**: Only essential data is collected
- **Secure Communications**: Email notifications with privacy in mind
- **Access Controls**: Strict role-based access to sensitive information

<div align="center">
  <img src="https://i.ibb.co/Jj4LBWL/security.png" alt="Security Features" width="600"/>
</div>

---

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate a user
- `POST /api/auth/verify`: Verify email with OTP
- `POST /api/auth/forgot-password`: Initiate password reset
- `POST /api/auth/reset-password`: Complete password reset

### User Endpoints
- `GET /api/users/profile`: Get current user profile
- `PUT /api/users/profile`: Update user profile
- `PUT /api/users/password`: Change password
- `POST /api/users/weight`: Add weight entry
- `GET /api/users/weight-history`: Get weight history

### Feed Endpoints
- `GET /api/posts`: Get all posts
- `POST /api/posts`: Create a new post
- `PUT /api/posts/:id/like`: Like/unlike a post
- `POST /api/posts/:id/comment`: Add a comment
- `DELETE /api/posts/:id`: Delete a post

### Admin Endpoints
- `GET /api/admin/users`: Get all users
- `GET /api/admin/users/:id`: Get specific user
- `PUT /api/admin/users/:id`: Update user
- `DELETE /api/admin/users/:id`: Delete user
- `GET /api/admin/stats`: Get system statistics

---

## Deployment

### Frontend Deployment
The frontend is deployed to Netlify:

**Live Site**: [flyfitnesszone.netlify.app](https://flyfitnesszone.netlify.app)

1. Build the production version:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy using the Netlify CLI or connect your GitHub repository for continuous deployment.

### Backend Deployment
The backend is deployed to Render:

1. Set up the required environment variables on the hosting platform.
2. Configure the deployment to use `npm start` as the start command.
3. Ensure the MongoDB connection string is properly configured.

### Database Deployment
MongoDB Atlas is used for database hosting:

1. Create a cluster on MongoDB Atlas.
2. Configure network access and database users.
3. Update the connection string in your backend environment variables.

<div align="center">
  <img src="https://i.ibb.co/Qp1Hnwz/deployment.png" alt="Deployment Architecture" width="700"/>
</div>

---

## Future Enhancements

### Planned Features
- **Mobile Application**: Native mobile apps for iOS and Android
- **Advanced Analytics**: Detailed fitness progress analytics
- **Nutrition Tracking**: Food logging and nutritional guidance
- **Workout Plans**: Personalized workout routines
- **Online Payments**: Integrated payment processing
- **Class Booking**: Online class reservation system
- **Video Content**: Instructional fitness videos
- **Gamification**: Achievement badges and challenges

<div align="center">
  <img src="https://i.ibb.co/Jj1Yfbw/roadmap.png" alt="Future Roadmap" width="600"/>
</div>

---

## Contributing

We welcome contributions to the Fly Fitness Zone project! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Contact

**Developer**: Aditya Aerpule  
**Email**: adityaaerpule@gmail.com  
**GitHub**: [coder-aadii](https://github.com/coder-aadii)

For support, feature requests, or bug reports, please open an issue on the GitHub repository.

---

<div align="center">
  <a href="https://flyfitnesszone.netlify.app" target="_blank">
    <img src="https://img.shields.io/badge/Visit%20Live%20Site-flyfitnesszone.netlify.app-orange?style=for-the-badge&logo=netlify" alt="Live Site" />
  </a>
  <p>© 2023 Fly Fitness Zone. All rights reserved.</p>
</div>