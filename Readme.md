# 🏋️‍♂️ Fly Fitness Zone

Fly Fitness Zone is a full-stack fitness class management web application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. This platform streamlines the management of members, classes, payments, and communication between admins and members, all through a clean and secure interface.

---

## 🚀 Features

### 🔐 Authentication

- Member and Admin role-based login system
- Secure authentication using JWT tokens
- Passwords encrypted with bcrypt

### 📋 Member Functionality

- Member registration & login
- Dashboard to view enrolled classes, payment history, and notifications
- Email notifications/reminders for upcoming classes or pending payments

### 🛠️ Admin Functionality

- Admin login portal
- Dashboard to manage:
  - Members list
  - Class schedules
  - Payment tracking
  - Sending notifications to members (with email support)

### 📧 Notifications

- Custom email reminders and updates using **Nodemailer**
- Notification history stored in the database

---

## 🧰 Tech Stack

| Technology            | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| **MongoDB**           | NoSQL database to store users, classes, payments, and notifications |
| **Express.js**        | Backend web application framework                              |
| **React.js**          | Frontend library for building user interfaces                  |
| **Node.js**           | JavaScript runtime for building server-side logic              |
| **Nodemailer**        | Sending transactional emails and reminders                     |
| **JWT (jsonwebtoken)**| For secure, role-based authentication                          |
| **bcrypt.js**         | For hashing user passwords securely                            |

---

## 📁 Project Structure

```
FlyFitnessZone/
├── fitness-backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── middleware/
│   └── server.js
│
├── fitness-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
```

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/coder-aadii/Fly-Fitness-zone.git
cd FlyFitnessZone
```

### 2. Set up the backend

```bash
cd fitness-backend
npm install
```

Create a `.env` file in `fitness-backend/` with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_email_password_or_app_password
```

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd ../fitness-frontend
npm install
npm start
```

The app will be available at:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## 🌐 Deployment

You can deploy the application as follows:

- **Frontend**: Netlify / Vercel
- **Backend**: Render / Railway / Cyclic
- **Database**: MongoDB Atlas

> Make sure to update your environment variables accordingly on your hosting platforms.

---

## 🧪 Testing & Security

- Ensure passwords are never stored in plaintext
- Use HTTPS in production
- Apply input validation on all forms
- Admin routes are protected using middleware

---

## 🛡️ Role-Based Access

| Role   | Access                                                                  |
| ------ | ----------------------------------------------------------------------- |
| Member | View dashboard, enrolled classes, payment status, receive notifications |
| Admin  | Manage users, classes, payments, and send notifications                 |

---

## 📬 Contact

**Developer**: Aditya Aerpule  
**Project**: Fly Fitness Zone

For feedback, suggestions, or queries, feel free to reach out via [GitHub Issues](https://github.com/coder-aadii/Fly-Fitness-zone/issues).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgments

Special thanks to:

- Node.js and React.js community
- MongoDB and Express.js documentation
- Stack Overflow for solutions
- Nodemailer team for simplifying email handling

---
