# MongoDB Atlas Setup Guide

Since we're having authentication issues with your MongoDB Atlas connection, here's a step-by-step guide to create a new database user and update your connection string:

## 1. Log in to MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in with your credentials

## 2. Create a New Database User

1. Select your project
2. In the left sidebar, click on "Database Access" under SECURITY
3. Click the "+ ADD NEW DATABASE USER" button
4. Choose "Password" for Authentication Method
5. Enter a new username (e.g., `flyfitness_admin`)
6. Enter a simple password without special characters (e.g., `FlyFitness2024`)
7. Under "Database User Privileges", select "Atlas admin" or "Read and write to any database"
8. Click "Add User"

## 3. Whitelist Your IP Address

1. In the left sidebar, click on "Network Access" under SECURITY
2. Click the "+ ADD IP ADDRESS" button
3. To allow access from anywhere (for development), click "ALLOW ACCESS FROM ANYWHERE"
   - Or enter your specific IP address
4. Click "Confirm"

## 4. Get Your New Connection String

1. Go back to your cluster view (click "Database" in the left sidebar)
2. Click the "Connect" button for your cluster
3. Select "Connect your application"
4. Copy the connection string provided
5. Replace `<password>` with the password you created for your new user
6. Replace `<dbname>` with `flyfitnesszone`

## 5. Update Your .env File

Update your .env file with the new connection string:

```
MONGO_URI=mongodb+srv://flyfitness_admin:FlyFitness2024@fog-cluster.x015l.mongodb.net/flyfitnesszone?retryWrites=true&w=majority
```

## 6. Test the Connection

Run the atlas-test.js script to verify the connection:

```
node atlas-test.js
```

If you still encounter issues, please check:
1. That the username and password are correct
2. That your IP address is whitelisted
3. That the cluster name in the connection string is correct