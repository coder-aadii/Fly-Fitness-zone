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

const sendContactEmail = async (formData) => {
    try {
        const { name, email, phone, message } = formData;
        
        // Email to gym admin
        const adminMailOptions = {
            from: `"Fly Fitness Zone Website" <${process.env.EMAIL_USER || 'noreply@flyfitness.com'}>`,
            to: process.env.EMAIL_USER || 'admin@flyfitness.com', // Send to gym's email
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #f97316;">New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                    <h3>Message:</h3>
                    <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
                    <p style="margin-top: 20px; font-size: 12px; color: #666;">
                        This message was sent from the contact form on the Fly Fitness Zone website.
                    </p>
                </div>
            `
        };

        // Confirmation email to the user
        const userMailOptions = {
            from: `"Fly Fitness Zone" <${process.env.EMAIL_USER || 'noreply@flyfitness.com'}>`,
            to: email,
            subject: 'Thank you for contacting Fly Fitness Zone',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #f97316;">Fly Fitness Zone</h2>
                    <p>Dear ${name},</p>
                    <p>Thank you for contacting Fly Fitness Zone. We have received your message and will get back to you shortly.</p>
                    <p>Here's a copy of your message:</p>
                    <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
                    <p>Best regards,</p>
                    <p>The Fly Fitness Zone Team</p>
                </div>
            `
        };

        // Send email to admin
        const adminInfo = await transporter.sendMail(adminMailOptions);
        // console.log('Admin email sent successfully:', adminInfo.response);
        
        // Send confirmation email to user
        const userInfo = await transporter.sendMail(userMailOptions);
        // console.log('User confirmation email sent successfully:', userInfo.response);
        
        return { adminInfo, userInfo };
    } catch (error) {
        console.error('Error sending contact email:', error);
        throw error; // Throw the error so the API can handle it
    }
};

module.exports = sendContactEmail;