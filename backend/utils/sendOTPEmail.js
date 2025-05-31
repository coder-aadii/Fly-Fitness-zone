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
        const mailOptions = {
            from: `"Fly Fitness Zone" <${process.env.EMAIL_USER || 'noreply@flyfitness.com'}>`,
            to: email,
            subject: 'Verify your Email - Fly Fitness Zone',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #f97316;">Fly Fitness Zone</h2>
                    <p>Thank you for registering with Fly Fitness Zone!</p>
                    <p>Your OTP for email verification is: <b>${otp}</b></p>
                    <p>It is valid for 10 minutes.</p>
                    <p style="margin-top: 20px; font-size: 12px; color: #666;">
                        If you did not request this OTP, please ignore this email.
                    </p>
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
