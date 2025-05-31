// test-email.js
const sendContactEmail = require('./utils/sendContactEmail');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testEmail() {
    console.log('Testing email functionality...');
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Password:', process.env.EMAIL_PASSWORD ? '******' : 'Not set');
    
    try {
        const testData = {
            name: 'Test User',
            email: process.env.EMAIL_USER, // Send to self for testing
            phone: '1234567890',
            message: 'This is a test message from the Fly Fitness Zone contact form test script.'
        };
        
        console.log('\nSending test email with the following data:');
        console.log(testData);
        
        const result = await sendContactEmail(testData);
        
        console.log('\nEmail sent successfully!');
        console.log('Admin email result:', result.adminInfo.response);
        console.log('User email result:', result.userInfo.response);
        
        console.log('\nEmail functionality is working correctly.');
    } catch (error) {
        console.error('\nError sending test email:', error);
        console.log('\nPlease check your email credentials in the .env file.');
    }
}

testEmail();