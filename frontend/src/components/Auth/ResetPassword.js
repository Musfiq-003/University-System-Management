// ======================================================
// Reset Password Component
// ======================================================
// Set new password using reset token from email
// ======================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import './Auth.css';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  // Form state
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: ''
  });
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: '',
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Alert state
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);
  
  // Check password strength whenever password changes
  useEffect(() => {
    checkPasswordStrength(formData.new_password);
  }, [formData.new_password]);
  
  // Check password strength
  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    
    let score = 0;
    let label = '';
    let color = '';
    
    if (password.length === 0) {
      score = 0;
      label = '';
      color = '';
    } else if (metRequirements <= 2) {
      score = 1;
      label = 'Weak';
      color = '#e74c3c';
    } else if (metRequirements === 3) {
      score = 2;
      label = 'Fair';
      color = '#f39c12';
    } else if (metRequirements === 4) {
      score = 3;
      label = 'Good';
      color = '#3498db';
    } else {
      score = 4;
      label = 'Strong';
      color = '#2ecc71';
    }
    
    setPasswordStrength({ score, label, color, requirements });
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Password validation
    if (!formData.new_password) {
      newErrors.new_password = 'Password is required';
    } else {
      const { requirements } = passwordStrength;
      if (!requirements.length) {
        newErrors.new_password = 'Password must be at least 8 characters';
      } else if (!requirements.uppercase) {
        newErrors.new_password = 'Password must contain at least one uppercase letter';
      } else if (!requirements.lowercase) {
        newErrors.new_password = 'Password must contain at least one lowercase letter';
      } else if (!requirements.number) {
        newErrors.new_password = 'Password must contain at least one number';
      } else if (!requirements.special) {
        newErrors.new_password = 'Password must contain at least one special character';
      }
    }
    
    // Confirm password validation
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setAlert({ show: false, message: '', type: '' });
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: formData.new_password
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setAlert({ show: true, message: data.message, type: 'success' });
        
        // Redirect to login after short delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          setAlert({ show: true, message: data.errors.join('. '), type: 'error' });
        } else {
          setAlert({ show: true, message: data.message, type: 'error' });
        }
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setAlert({ 
        show: true, 
        message: 'Network error. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>✓ Password Reset Successful</h1>
          </div>
          
          <div className="success-message-box">
            <p className="success-icon">✓</p>
            <h3>Your password has been reset!</h3>
            <p>You can now login with your new password.</p>
            <p className="redirect-text">Redirecting to login page...</p>
          </div>
          
          <div className="auth-footer">
            <Link to="/login" className="btn btn-primary">Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🔑 Reset Password</h1>
          <h2>Create New Password</h2>
        </div>
        
        <div className="info-box">
          <p>Please create a strong password that meets all security requirements.</p>
        </div>
        
        {alert.show && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {/* New Password Field with Strength Meter */}
          <div className="form-group">
            <label htmlFor="new_password">
              New Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className={errors.new_password ? 'error' : ''}
              placeholder="Create a strong password"
              disabled={isSubmitting}
            />
            {errors.new_password && <span className="error-message">{errors.new_password}</span>}
            
            {/* Password Strength Indicator */}
            {formData.new_password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-progress" 
                    style={{
                      width: `${(passwordStrength.score / 4) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  ></div>
                </div>
                <span className="strength-label" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
            
            {/* Password Requirements */}
            <div className="password-requirements">
              <p className="requirements-title">Password must contain:</p>
              <ul>
                <li className={passwordStrength.requirements.length ? 'met' : ''}>
                  {passwordStrength.requirements.length ? '✓' : '○'} At least 8 characters
                </li>
                <li className={passwordStrength.requirements.uppercase ? 'met' : ''}>
                  {passwordStrength.requirements.uppercase ? '✓' : '○'} One uppercase letter
                </li>
                <li className={passwordStrength.requirements.lowercase ? 'met' : ''}>
                  {passwordStrength.requirements.lowercase ? '✓' : '○'} One lowercase letter
                </li>
                <li className={passwordStrength.requirements.number ? 'met' : ''}>
                  {passwordStrength.requirements.number ? '✓' : '○'} One number
                </li>
                <li className={passwordStrength.requirements.special ? 'met' : ''}>
                  {passwordStrength.requirements.special ? '✓' : '○'} One special character (!@#$%^&*)
                </li>
              </ul>
            </div>
          </div>
          
          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirm_password">
              Confirm New Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className={errors.confirm_password ? 'error' : ''}
              placeholder="Re-enter your new password"
              disabled={isSubmitting}
            />
            {errors.confirm_password && <span className="error-message">{errors.confirm_password}</span>}
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting || passwordStrength.score < 3}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
          
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

export default ResetPassword;
