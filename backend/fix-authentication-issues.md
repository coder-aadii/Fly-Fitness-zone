# Authentication Issues Fix Guide

## Issues Identified

1. **MongoDB Connection**: Fixed by updating the password in the .env file.
2. **Admin Dashboard User Data Fetching**: Likely related to JWT token handling or CORS issues.
3. **User Login Issues**: Possibly related to password verification or verification status.

## Solutions

### 1. Verify MongoDB Connection

The MongoDB connection is now working correctly with the updated password. The database contains 2 users:
- Aditya Aerpule (adityaaerpule@gmail.com)
- Parinay Raya (parinayraya7432@gmail.com)

Both users are marked as verified in the database.

### 2. Fix Admin Dashboard Issues

#### Check Frontend JWT Token Handling

1. Make sure the admin token is being properly stored after login:
   ```javascript
   // After successful admin login
   localStorage.setItem('token', response.data.token);
   ```

2. Ensure the token is being sent with each request:
   ```javascript
   // Example axios configuration
   axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
   ```

3. Verify the token hasn't expired. Admin tokens are set to expire after 1 day.

#### Test Admin API Endpoints

Use the test-admin-auth.js script to generate a valid admin token, then test the admin endpoints:

```
node test-admin-auth.js
```

Use the generated token to test the admin endpoints with a tool like Postman or curl:

```
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" http://localhost:5000/api/admin/users
```

### 3. Fix User Login Issues

#### Reset User Passwords (if needed)

If users are unable to log in due to password issues, you can reset their passwords:

1. Run this script to reset a specific user's password:

```javascript
// reset-user-password.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const User = mongoose.model('User', require('./models/User').schema);
    
    const email = 'adityaaerpule@gmail.com'; // Replace with the user's email
    const newPassword = 'NewPassword123'; // Replace with the new password
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      return;
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();
    
    console.log(`Password reset successful for ${email}`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.connection.close();
  }
}

resetPassword();
```

#### Verify User Verification Status

If users are unable to log in due to verification status:

1. Check if users are marked as verified in the database:

```javascript
// verify-user.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function verifyUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const User = mongoose.model('User', require('./models/User').schema);
    
    const email = 'adityaaerpule@gmail.com'; // Replace with the user's email
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      return;
    }
    
    user.isVerified = true;
    await user.save();
    
    console.log(`User ${email} has been verified`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.connection.close();
  }
}

verifyUser();
```

### 4. Check for CORS Issues

If you're experiencing CORS issues, verify the CORS configuration in server.js:

```javascript
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
```

Make sure the frontend is running on the same origin specified in the CORS configuration.

### 5. Restart the Server

After making these changes, restart the server:

```
node server.js
```

## Testing

1. Test admin login using the admin credentials in the .env file.
2. Test user login using the test-user-login.js script (update with the correct password).
3. Test the admin dashboard by logging in as admin and navigating to the users page.

If issues persist, check the server logs for specific error messages.