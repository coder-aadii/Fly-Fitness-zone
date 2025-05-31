const fetch = require('node-fetch');
require('dotenv').config();

const adminEmail = process.env.ADMIN_EMAIL || 'admin@flyfitness.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

async function testAdminLogin() {
  try {
    console.log(`Testing admin login with: ${adminEmail} / ${adminPassword}`);
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword
      })
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('Admin login successful!');
      console.log('Token:', data.token);
      console.log('User role:', data.user.role);
    } else {
      console.log('Admin login failed!');
    }
  } catch (error) {
    console.error('Error testing admin login:', error);
  }
}

testAdminLogin();