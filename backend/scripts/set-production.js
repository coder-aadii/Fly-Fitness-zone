// scripts/set-production.js
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Path to .env file
const envPath = path.join(__dirname, '..', '.env');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error('.env file not found');
  process.exit(1);
}

// Load current .env file
const envConfig = dotenv.parse(fs.readFileSync(envPath));

// Set NODE_ENV to production
envConfig.NODE_ENV = 'production';

// Convert config object back to .env format
const newEnv = Object.entries(envConfig)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

// Write updated .env file
fs.writeFileSync(envPath, newEnv);

console.log('NODE_ENV set to production in .env file');