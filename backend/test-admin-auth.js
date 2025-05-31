// test-admin-auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

function testAdminAuth() {
    try {
        console.log('Testing admin authentication...');
        
        // Get admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@flyfitness.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        
        console.log(`Admin Email: ${adminEmail}`);
        console.log(`Admin Password: ${adminPassword.substring(0, 2)}${'*'.repeat(adminPassword.length - 2)}`);
        
        // Create JWT token for admin
        const adminPayload = {
            userId: 'admin-id',
            email: adminEmail,
            role: 'admin'
        };

        const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
        console.log(`JWT Secret: ${jwtSecret.substring(0, 5)}${'*'.repeat(5)}`);
        
        const adminToken = jwt.sign(
            adminPayload,
            jwtSecret,
            { expiresIn: '1d' }
        );
        
        console.log('\nGenerated Admin Token:');
        console.log(adminToken);
        
        // Verify the token
        console.log('\nVerifying token...');
        const decoded = jwt.verify(adminToken, jwtSecret);
        console.log('Token verified successfully!');
        console.log('Decoded token payload:', decoded);
        
        console.log('\nTo test admin API endpoints, use this token in your Authorization header:');
        console.log('Authorization: Bearer ' + adminToken);
    } catch (err) {
        console.error('Error:', err);
    }
}

testAdminAuth();