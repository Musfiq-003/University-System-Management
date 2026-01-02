// ======================================================
// Authentication Controller
// ======================================================
// Handles user registration, login, OTP verification,
// password reset with comprehensive security features
// ======================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendOTPEmail, sendPasswordResetEmail, generateOTP } = require('../services/emailService');
const crypto = require('crypto');

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

// Account lockout settings
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

// OTP and reset token expiry
const OTP_EXPIRY_MINUTES = 10;
const RESET_TOKEN_EXPIRY_MINUTES = 30;

// ======================================================
// PASSWORD VALIDATION
// ======================================================

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
function validatePasswordStrength(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumber) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ======================================================
// EMAIL VALIDATION
// ======================================================

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ======================================================
// USER REGISTRATION
// ======================================================

/**
 * Register a new user
 * POST /api/auth/register
 * Body: { full_name, email, password }
 * Note: Role will be set to 'pending' and admin will assign actual role after verification
 */
exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    
    // Validate required fields
    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (full_name, email, password)'
      });
    }
    
    // Validate full name
    if (full_name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 2 characters long'
      });
    }
    
    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet security requirements',
        errors: passwordValidation.errors
      });
    }
    
    // Set role to 'pending' - admin will assign actual role after verification
    const userRole = 'pending';
    
    // Check if email already exists
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);
    
    // Insert new user
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password_hash, role, is_verified, otp, otp_expiry) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [full_name.trim(), email.toLowerCase(), password_hash, userRole, false, otp, otpExpiry]
    );
    
    // Send OTP email
    await sendOTPEmail(email, full_name, otp);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for OTP verification code.',
      data: {
        user_id: result.insertId,
        email: email.toLowerCase(),
        requires_verification: true
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again later.'
    });
  }
};

// ======================================================
// OTP VERIFICATION
// ======================================================

/**
 * Verify OTP and activate user account
 * POST /api/auth/verify-otp
 * Body: { email, otp }
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Validate inputs
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }
    
    // Get user
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = users[0];
    
    // Check if already verified
    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: 'Account is already verified'
      });
    }
    
    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code'
      });
    }
    
    // Check OTP expiry
    if (new Date() > new Date(user.otp_expiry)) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }
    
    // Mark user as verified
    await db.query(
      'UPDATE users SET is_verified = TRUE, otp = NULL, otp_expiry = NULL WHERE email = ?',
      [email.toLowerCase()]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        user_id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      message: 'Email verified successfully! You can now login.',
      data: {
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        }
      }
    });
    
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed. Please try again.'
    });
  }
};

// ======================================================
// RESEND OTP
// ======================================================

/**
 * Resend OTP to user email
 * POST /api/auth/resend-otp
 * Body: { email }
 */
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Get user
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = users[0];
    
    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: 'Account is already verified'
      });
    }
    
    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);
    
    // Update OTP
    await db.query(
      'UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?',
      [otp, otpExpiry, email.toLowerCase()]
    );
    
    // Send OTP email
    await sendOTPEmail(email, user.full_name, otp);
    
    res.json({
      success: true,
      message: 'New OTP sent to your email'
    });
    
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    });
  }
};

// ======================================================
// USER LOGIN
// ======================================================

/**
 * Login user
 * POST /api/auth/login
 * Body: { email, password }
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Get user
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    
    if (users.length === 0) {
      // Log failed attempt
      await db.query(
        'INSERT INTO login_attempts (email, ip_address, success) VALUES (?, ?, FALSE)',
        [email.toLowerCase(), ipAddress]
      );
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    const user = users[0];
    
    // Check account lockout
    if (user.account_locked_until && new Date() < new Date(user.account_locked_until)) {
      const minutesLeft = Math.ceil((new Date(user.account_locked_until) - new Date()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account temporarily locked. Please try again in ${minutesLeft} minutes.`
      });
    }
    
    // Check if email is verified
    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in. Check your email for OTP.',
        requires_verification: true
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      // Increment failed attempts
      const newFailedAttempts = user.failed_login_attempts + 1;
      let lockUntil = null;
      
      if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60000);
        await db.query(
          'UPDATE users SET failed_login_attempts = ?, last_failed_login = NOW(), account_locked_until = ? WHERE email = ?',
          [newFailedAttempts, lockUntil, email.toLowerCase()]
        );
        
        return res.status(423).json({
          success: false,
          message: `Too many failed attempts. Account locked for ${LOCKOUT_DURATION_MINUTES} minutes.`
        });
      } else {
        await db.query(
          'UPDATE users SET failed_login_attempts = ?, last_failed_login = NOW() WHERE email = ?',
          [newFailedAttempts, email.toLowerCase()]
        );
      }
      
      // Log failed attempt
      await db.query(
        'INSERT INTO login_attempts (email, ip_address, success) VALUES (?, ?, FALSE)',
        [email.toLowerCase(), ipAddress]
      );
      
      const attemptsLeft = MAX_FAILED_ATTEMPTS - newFailedAttempts;
      return res.status(401).json({
        success: false,
        message: `Invalid email or password. ${attemptsLeft} attempts remaining.`
      });
    }
    
    // Reset failed attempts on successful login
    await db.query(
      'UPDATE users SET failed_login_attempts = 0, account_locked_until = NULL WHERE email = ?',
      [email.toLowerCase()]
    );
    
    // Log successful attempt
    await db.query(
      'INSERT INTO login_attempts (email, ip_address, success) VALUES (?, ?, TRUE)',
      [email.toLowerCase(), ipAddress]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        user_id: user.id, 
        email: user.email, 
        role: user.role,
        full_name: user.full_name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          department: user.department,
          designation: user.designation,
          batch: user.batch,
          studentId: user.studentId
        }
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// ======================================================
// FORGOT PASSWORD
// ======================================================

/**
 * Request password reset
 * POST /api/auth/forgot-password
 * Body: { email }
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Get user
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    
    // Always return success to prevent email enumeration
    if (users.length === 0) {
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent.'
      });
    }
    
    const user = users[0];
    
    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60000);
    
    // Save reset token
    await db.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [resetToken, resetTokenExpiry, email.toLowerCase()]
    );
    
    // Send password reset email
    await sendPasswordResetEmail(email, user.full_name, resetToken);
    
    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent.'
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process request'
    });
  }
};

// ======================================================
// RESET PASSWORD
// ======================================================

/**
 * Reset password with token
 * POST /api/auth/reset-password
 * Body: { token, new_password }
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;
    
    if (!token || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }
    
    // Validate new password strength
    const passwordValidation = validatePasswordStrength(new_password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet security requirements',
        errors: passwordValidation.errors
      });
    }
    
    // Get user by reset token
    const [users] = await db.query(
      'SELECT * FROM users WHERE reset_token = ?',
      [token]
    );
    
    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    const user = users[0];
    
    // Check token expiry
    if (new Date() > new Date(user.reset_token_expiry)) {
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired. Please request a new one.'
      });
    }
    
    // Hash new password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(new_password, saltRounds);
    
    // Update password and clear reset token
    await db.query(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL, failed_login_attempts = 0 WHERE id = ?',
      [password_hash, user.id]
    );
    
    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};

// ======================================================
// GET CURRENT USER
// ======================================================

/**
 * Get current user profile (requires authentication)
 * GET /api/auth/me
 */
exports.getCurrentUser = async (req, res) => {
  try {
    // User info is attached by auth middleware
    const userId = req.user.user_id;
    
    const [users] = await db.query(
      'SELECT id, full_name, email, role, is_verified, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        user: users[0]
      }
    });
    
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information'
    });
  }
};

// ======================================================
// LOGOUT
// ======================================================

/**
 * Logout user (client should delete token)
 * POST /api/auth/logout
 */
exports.logout = async (req, res) => {
  // With JWT, logout is handled on client side by deleting token
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

// ======================================================
// ADMIN: GET ALL USERS
// ======================================================

/**
 * Get all users (admin only)
 * GET /api/auth/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, full_name, email, role, is_verified, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving users'
    });
  }
};

// ======================================================
// ADMIN: UPDATE USER ROLE
// ======================================================

/**
 * Update user role (admin only)
 * PUT /api/auth/users/:userId/role
 * Body: { role }
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    // Validate role
    const validRoles = ['admin', 'student', 'faculty', 'pending'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be: admin, student, faculty, or pending'
      });
    }
    
    // Update user role
    const [result] = await db.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role'
    });
  }
};
