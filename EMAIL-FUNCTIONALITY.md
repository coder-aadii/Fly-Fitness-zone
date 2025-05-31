# Email Functionality in Fly Fitness Zone

This document explains how the email functionality works in the Fly Fitness Zone application and how to test it.

## Overview

The application uses the email credentials stored in the `.env` file to send emails for:

1. **OTP Verification**: When a user registers, an OTP is sent to their email for verification.
2. **Contact Form**: When a user submits the contact form, emails are sent to both the gym admin and the user.

## Email Configuration

The email configuration is stored in the `.env` file in the backend directory:

```
EMAIL_USER=aaerpule@gmail.com
EMAIL_PASSWORD=tqstauqfymevuphw
```

These credentials are used to send emails via Gmail's SMTP server.

## How It Works

### OTP Verification

1. When a user registers, an OTP is generated and stored in the database.
2. The OTP is sent to the user's email using the `sendOTPEmail` utility.
3. The user enters the OTP to verify their email.

### Contact Form

1. When a user submits the contact form, the data is sent to the backend API.
2. The backend uses the `sendContactEmail` utility to send two emails:
   - An email to the gym admin (using EMAIL_USER from .env) with the contact form details.
   - A confirmation email to the user who submitted the form.

## Testing Email Functionality

### Test Script

A test script is provided to verify that the email functionality is working correctly:

```bash
cd backend
node test-email.js
```

This script will:
1. Check if the email credentials are set in the `.env` file.
2. Send a test email to the email address specified in the `.env` file.
3. Log the results of the email sending operation.

### Manual Testing

You can also test the email functionality manually:

1. Start the backend server:
   ```bash
   cd backend
   node server.js
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Navigate to the contact form on the website and submit a test message.

## Troubleshooting

If emails are not being sent:

1. Check that the email credentials in the `.env` file are correct.
2. Ensure that "Less secure app access" is enabled for the Gmail account (or use an App Password).
3. Check the server logs for any error messages related to email sending.
4. Run the test script to diagnose any issues.

## Security Considerations

- The email password is stored in the `.env` file, which should never be committed to version control.
- Consider using environment variables in production deployments rather than a `.env` file.
- For production, consider using a dedicated email service like SendGrid, Mailgun, or Amazon SES instead of Gmail.