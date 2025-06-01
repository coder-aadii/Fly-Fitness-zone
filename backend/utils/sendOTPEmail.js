const nodemailer = require('nodemailer');
require('dotenv').config(); // Load .env variables

// Create a transporter with better error handling
const createTransporter = () => {
    // Check if email credentials are available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.error('Email credentials missing in .env file. Please add EMAIL_USER and EMAIL_PASSWORD.');
        // Return a dummy transporter that logs instead of sending
        return {
            sendMail: async (mailOptions) => {
                // console.log('Email would be sent (DUMMY MODE):', mailOptions);
                // console.log('OTP for testing:', mailOptions.html.match(/<b>(\d+)<\/b>/)[1]);
                return { response: 'Dummy email sent' };
            }
        };
    }

    // Create real transporter if credentials exist
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

const transporter = createTransporter();

const sendOTPEmail = async (email, otp) => {
    try {
        // Get the frontend URL from environment variables or use default
        const frontendUrl = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:3000';
        
        // Create a verification link that pre-fills the email
        const verificationLink = `${frontendUrl}/verify-otp?email=${encodeURIComponent(email)}`;
        
        const mailOptions = {
            from: `"Fly Fitness Zone" <${process.env.EMAIL_USER || 'noreply@flyfitness.com'}>`,
            to: email,
            subject: 'Verify your Email - Fly Fitness Zone',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #f97316; margin-bottom: 5px;">Fly Fitness Zone</h2>
                        <p style="color: #666; font-size: 14px;">Your fitness journey starts here</p>
                    </div>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <p style="margin-top: 0;">Thank you for registering with Fly Fitness Zone!</p>
                        <p>Please use the following OTP to verify your email address:</p>
                        
                        <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 15px 0;">
                            ${otp}
                        </div>
                        
                        <p style="margin-bottom: 0;">This OTP is valid for 10 minutes.</p>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 20px;">
                        <p>Or click the button below to go to the verification page:</p>
                        <a href="${verificationLink}" style="display: inline-block; background-color: #f97316; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
                            Verify Email
                        </a>
                    </div>
                    
                    <div style="border-top: 1px solid #e0e0e0; padding-top: 15px; margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
                        <p>If you did not request this OTP, please ignore this email.</p>
                        <p>&copy; ${new Date().getFullYear()} Fly Fitness Zone. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        // console.log('Email sent successfully:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw the error, just log it - this prevents registration from failing
        // if email sending fails
    }
};

module.exports = sendOTPEmail;
