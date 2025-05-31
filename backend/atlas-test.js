// atlas-test.js
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get the MongoDB URI from environment variables
const uri = process.env.MONGO_URI;

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log('Connection string (password masked):');
    console.log(uri.replace(/(mongodb\+srv:\/\/[^:]+:)([^@]+)(@.+)/, '$1*****$3'));
    
    // Connect the client to the server
    await client.connect();
    
    // Verify connection by listing databases
    const adminDb = client.db('admin');
    const result = await adminDb.command({ ping: 1 });
    console.log('Connected successfully to MongoDB Atlas!');
    
    // List all databases the user has access to
    console.log('\nListing available databases:');
    const dbs = await client.db().admin().listDatabases();
    dbs.databases.forEach(db => {
      console.log(` - ${db.name}`);
    });

    console.log('\nConnection test successful!');
  } catch (err) {
    console.error('Connection error:', err);
    
    if (err.name === 'MongoServerError' && err.code === 8000) {
      console.log('\nThis is an authentication error. Possible solutions:');
      console.log('1. Check if the username is correct');
      console.log('2. Check if the password is correct (and properly URL-encoded if it contains special characters)');
      console.log('3. Verify that the user has access to the specified database');
      console.log('4. Ensure your IP address is whitelisted in MongoDB Atlas');
      console.log('5. Try creating a new database user in MongoDB Atlas with a simple password');
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log('Connection closed');
  }
}

run().catch(console.dir);