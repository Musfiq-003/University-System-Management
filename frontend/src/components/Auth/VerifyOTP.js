// ======================================================
// OTP Verification Component
// ======================================================
// Verify email with OTP code sent during registration
// ======================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Auth.css';

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  // Form state
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  // Alert state
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  // Timer state
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);
  
  // Countdown timer for resend
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);
  
  // Handle OTP input (only allow numbers, max 6 digits)
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setAlert({ show: false, message: '', type: '' });
  };
  
  // Handle OTP verification
  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setAlert({ show: true, message: 'Please enter a valid 6-digit OTP', type: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    setAlert({ show: false, message: '', type: '' });
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store token and user info
        if (data.data?.token) {
          localStorage.setItem('auth_token', data.data.token);
          localStorage.setItem('user_info', JSON.stringify(data.data.user));
        }
        
        setAlert({ show: true, message: 'Email verified successfully! Redirecting...', type: 'success' });
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setAlert({ show: true, message: data.message, type: 'error' });
        setOtp('');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setAlert({ 
        show: true, 
        message: 'Network error. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle resend OTP
  const handleResend = async () => {
    setIsResending(true);
    setAlert({ show: false, message: '', type: '' });
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAlert({ show: true, message: 'New OTP sent to your email!', type: 'success' });
        setTimer(60);
        setCanResend(false);
        setOtp('');
      } else {
        setAlert({ show: true, message: data.message, type: 'error' });
      }
    } catch (error) {
      console.error('Resend error:', error);
      setAlert({ show: true, message: 'Failed to resend OTP. Please try again.', type: 'error' });
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>📧 Email Verification</h1>
          <h2>Enter OTP Code</h2>
        </div>
        
        <div className="otp-info">
          <p>We've sent a 6-digit verification code to:</p>
          <p className="email-display">{email}</p>
          <p className="info-text">Please check your email and enter the code below.</p>
        </div>
        
        {alert.show && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
        
        <form onSubmit={handleVerify} className="auth-form">
          {/* OTP Input */}
          <div className="form-group">
            <label htmlFor="otp">
              Verification Code <span className="required">*</span>
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              className="otp-input"
              placeholder="Enter 6-digit code"
              maxLength="6"
              disabled={isSubmitting}
              autoFocus
            />
            <p className="helper-text">
              {otp.length}/6 digits entered
            </p>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting || otp.length !== 6}
          >
            {isSubmitting ? 'Verifying...' : 'Verify Email'}
          </button>
          
          {/* Resend OTP */}
          <div className="resend-section">
            <p>Didn't receive the code?</p>
            {canResend ? (
              <button 
                type="button"
                onClick={handleResend}
                className="btn btn-link"
                disabled={isResending}
              >
                {isResending ? 'Sending...' : 'Resend OTP'}
              </button>
            ) : (
              <span className="timer">Resend in {timer}s</span>
            )}
          </div>
          
          {/* Back to Login */}
          <div className="auth-footer">
            <p>
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyOTP;
