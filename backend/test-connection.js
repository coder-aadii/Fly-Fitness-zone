// test-connection.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('Attempting to connect to MongoDB with URI:');
// Print the URI with password masked for security
const maskedUri = process.env.MONGO_URI.replace(
  /(mongodb\+srv:\/\/[^:]+:)([^@]+)(@.+)/,
  '$1*****$3'
);
console.log(maskedUri);

// Try connecting with a timeout
const connectWithTimeout = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log('MongoDB Connected Successfully!');
    return true;
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    if (err.name === 'MongoServerError' && err.code === 8000) {
      console.log('\nThis is an authentication error. Possible causes:');
      console.log('1. Username or password is incorrect');
      console.log('2. The user does not have access to the database');
      console.log('3. The database name might be incorrect');
      console.log('4. Your IP address might not be whitelisted in MongoDB Atlas');
    }
    return false;
  } finally {
    // Close the connection regardless of outcome
    try {
      await mongoose.connection.close();
      console.log('Connection closed');
    } catch (err) {
      // Ignore errors on close
    }
  }
};

// Run the test
connectWithTimeout().then(success => {
  process.exit(success ? 0 : 1);
});