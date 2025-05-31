// check-users.js
const mongoose = require('mongoose');
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
    // Other fields are not needed for this check
}, { 
    collection: 'users',
    timestamps: true 
});

async function checkUsers() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Create model
        const User = mongoose.model('User', UserSchema);
        
        // Count users
        const userCount = await User.countDocuments();
        console.log(`Total users in database: ${userCount}`);
        
        if (userCount > 0) {
            // Get a sample of users (limit to 5)
            const users = await User.find().limit(5).select('name email isVerified role createdAt');
            console.log('\nSample users:');
            users.forEach(user => {
                console.log(`- ${user.name} (${user.email}), Verified: ${user.isVerified}, Role: ${user.role}, Created: ${user.createdAt}`);
            });
        } else {
            console.log('No users found in the database.');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
        console.log('Connection closed');
    }
}

checkUsers();