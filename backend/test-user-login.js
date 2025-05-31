// test-user-login.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define User model schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    isVerified: Boolean,
    // Other fields are not needed for this test
}, { 
    collection: 'users',
    timestamps: true 
});

async function testUserLogin() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Create model
        const User = mongoose.model('User', UserSchema);
        
        // Test user credentials
        const testEmail = 'adityaaerpule@gmail.com';
        const testPassword = 'password123'; // Replace with actual password to test
        
        console.log(`\nTesting login for user: ${testEmail}`);
        
        // Find user by email
        const user = await User.findOne({ email: testEmail });
        
        if (!user) {
            console.log(`User with email ${testEmail} not found in database`);
            return;
        }
        
        console.log('User found in database:');
        console.log(`- Name: ${user.name}`);
        console.log(`- Email: ${user.email}`);
        console.log(`- Verified: ${user.isVerified}`);
        console.log(`- Role: ${user.role}`);
        
        // Check if email is verified
        if (!user.isVerified) {
            console.log('\nERROR: User email is not verified. Login would fail.');
            return;
        }
        
        // Compare password (this will fail unless you provide the correct password)
        console.log('\nTesting password match...');
        const isMatch = await bcrypt.compare(testPassword, user.password);
        
        if (!isMatch) {
            console.log('ERROR: Password does not match. Login would fail.');
            return;
        }
        
        console.log('Password matches! Login would succeed.');
        
        // Create JWT token
        const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
        const payload = {
            userId: user._id,
            email: user.email,
            role: user.role
        };
        
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
        
        console.log('\nGenerated User Token:');
        console.log(token);
        
        console.log('\nTo test user API endpoints, use this token in your Authorization header:');
        console.log('Authorization: Bearer ' + token);
        
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnection closed');
    }
}

testUserLogin();