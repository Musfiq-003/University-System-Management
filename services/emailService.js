// ======================================================
// Email Service - OTP & Password Reset
// Uses nodemailer to send verification emails
// Configure with your SMTP settings or use Gmail
// ======================================================

const nodemailer = require('nodemailer');

// Email configuration
// For production, use environment variables
const EMAIL_CONFIG = {
  service: 'gmail', // or 'smtp.mailtrap.io' for testing
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Replace with your email
    pass: process.env.EMAIL_PASSWORD || 'your-app-password' // Replace with app password
  }
};

// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('⚠️  Email service not configured:', error.message);
    console.log('   OTPs will be logged to console instead');
  } else {
    console.log('✅ Email service ready to send messages');
  }
});

/**
 * Send OTP verification email
 * @param {string} email - Recipient email address
 * @param {string} fullName - Recipient full name
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<boolean>} - Success status
 */
async function sendOTPEmail(email, fullName, otp) {
  try {
    const mailOptions = {
      from: `"University Management System" <${EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: 'Email Verification - Your OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { text-align: center; color: #3b82f6; margin-bottom: 30px; }
            .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
            .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 10px 0; }
            .info { color: #666; font-size: 14px; line-height: 1.6; }
            .warning { color: #e74c3c; font-size: 12px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 University Management System</h1>
              <h2>Email Verification</h2>
            </div>
            
            <p>Hello <strong>${fullName}</strong>,</p>
            
            <p class="info">Thank you for registering with the University Management System. To complete your registration, please verify your email address using the OTP code below:</p>
            
            <div class="otp-box">
              <p style="margin: 0; font-size: 14px;">Your OTP Code:</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; font-size: 12px;">Valid for 10 minutes</p>
            </div>
            
            <p class="info">Enter this code on the verification page to activate your account.</p>
            
            <p class="warning">
              ⚠️ <strong>Security Notice:</strong><br>
              • Do not share this OTP with anyone<br>
              • This code expires in 10 minutes<br>
              • If you didn't request this, please ignore this email
            </p>
            
            <div class="footer">
              <p>This is an automated message, please do not reply.</p>
              <p>&copy; 2025 University Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Try to send email, fallback to console log
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent to ${email}`);
      return true;
    } catch (emailError) {
      console.log(`⚠️  Could not send email to ${email}`);
      console.log(`📧 OTP for ${email}: ${otp} (expires in 10 minutes)`);
      // Return true anyway since we logged it
      return true;
    }
  } catch (error) {
    console.error('Email service error:', error.message);
    console.log(`📧 OTP for ${email}: ${otp} (logged due to email error)`);
    return false;
  }
}

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} fullName - Recipient full name
 * @param {string} resetToken - Password reset token
 * @returns {Promise<boolean>} - Success status
 */
async function sendPasswordResetEmail(email, fullName, resetToken) {
  try {
    const resetLink = `http://localhost:3001/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"University Management System" <${EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { text-align: center; color: #3b82f6; margin-bottom: 30px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .info { color: #666; font-size: 14px; line-height: 1.6; }
            .warning { color: #e74c3c; font-size: 12px; margin-top: 20px; }
            .link-box { background-color: #f8f9fa; padding: 15px; border-radius: 5px; word-break: break-all; margin: 15px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Password Reset Request</h1>
            </div>
            
            <p>Hello <strong>${fullName}</strong>,</p>
            
            <p class="info">We received a request to reset your password for your University Management System account.</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            
            <p class="info">Or copy and paste this link into your browser:</p>
            <div class="link-box">
              ${resetLink}
            </div>
            
            <p class="warning">
              ⚠️ <strong>Security Notice:</strong><br>
              • This link expires in 30 minutes<br>
              • If you didn't request this reset, please ignore this email<br>
              • Your password will remain unchanged until you set a new one
            </p>
            
            <div class="footer">
              <p>This is an automated message, please do not reply.</p>
              <p>&copy; 2025 University Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${email}`);
      return true;
    } catch (emailError) {
      console.log(`⚠️  Could not send email to ${email}`);
      console.log(`🔗 Reset link for ${email}: ${resetLink}`);
      return true;
    }
  } catch (error) {
    console.error('Email service error:', error.message);
    return false;
  }
}

/**
 * Generate 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
  generateOTP
};
