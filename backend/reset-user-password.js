// reset-user-password.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Define User model schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    isVerified: Boolean,
    // Other fields are not needed for this script
}, { 
    collection: 'users',
    timestamps: true 
});

async function resetPassword() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const User = mongoose.model('User', UserSchema);
    
    // Replace with the user's email whose password you want to reset
    const email = 'adityaaerpule@gmail.com';
    // Replace with the new password
    const newPassword = 'NewPassword123';
    
    console.log(`Attempting to reset password for user: ${email}`);
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      return;
    }
    
    console.log('User found. Resetting password...');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();
    
    console.log(`Password reset successful for ${email}`);
    console.log(`New password: ${newPassword}`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

resetPassword();