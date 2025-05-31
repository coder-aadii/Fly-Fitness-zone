// Run this script with: node tests/bcrypt-test.js
const bcrypt = require('bcryptjs'); // or require('bcrypt') - use the SAME one as your app

async function testBcrypt() {
  try {
    console.log('Testing bcrypt password hashing and comparison...');
    
    // Test password
    const password = 'TestPassword123!';
    
    // Hash the password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log('Original password:', password);
    console.log('Hashed password:', hash);
    console.log('Hash length:', hash.length);
    
    // Test comparison with correct password
    const correctMatch = await bcrypt.compare(password, hash);
    console.log('Correct password comparison result:', correctMatch); // Should be true
    
    // Test comparison with incorrect password
    const incorrectMatch = await bcrypt.compare('WrongPassword123!', hash);
    console.log('Incorrect password comparison result:', incorrectMatch); // Should be false
    
    // Test with a known hash (for debugging)
    if (process.argv[2]) {
      const knownHash = process.argv[2];
      const knownPassword = process.argv[3] || password;
      
      console.log('\nTesting with provided hash and password:');
      console.log('Hash:', knownHash);
      console.log('Password:', knownPassword);
      
      const knownMatch = await bcrypt.compare(knownPassword, knownHash);
      console.log('Known hash comparison result:', knownMatch);
    }
    
  } catch (error) {
    console.error('Error testing bcrypt:', error);
  }
}

testBcrypt();