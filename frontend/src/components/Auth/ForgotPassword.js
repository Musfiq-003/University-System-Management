// ======================================================
// Forgot Password Component
// ======================================================
// Request password reset link via email
// ======================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

function ForgotPassword() {
  // Form state
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Alert state
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email.trim()) {
      setAlert({ show: true, message: 'Email is required', type: 'error' });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAlert({ show: true, message: 'Invalid email format', type: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    setAlert({ show: false, message: '', type: '' });
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase() })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
        setAlert({ 
          show: true, 
          message: data.message, 
          type: 'success' 
        });
      } else {
        setAlert({ show: true, message: data.message, type: 'error' });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setAlert({ 
        show: true, 
        message: 'Network error. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>✉️ Check Your Email</h1>
          </div>
          
          <div className="success-message-box">
            <p className="success-icon">✓</p>
            <h3>Password Reset Link Sent!</h3>
            <p>
              If an account exists for <strong>{email}</strong>, you will receive an email with instructions to reset your password.
            </p>
            <p className="info-text">
              The reset link will expire in 30 minutes for security reasons.
            </p>
          </div>
          
          <div className="auth-footer">
            <p>
              <Link to="/login">Back to Login</Link>
            </p>
            <p>
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                onClick={() => { setSubmitted(false); setEmail(''); }}
                className="btn-link-inline"
              >
                try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🔒 Forgot Password</h1>
          <h2>Reset Your Password</h2>
        </div>
        
        <div className="info-box">
          <p>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        {alert.show && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
          
          {/* Back to Login */}
          <div className="auth-footer">
            <p>
              Remember your password? <Link to="/login">Login here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
