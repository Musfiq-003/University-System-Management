// ======================================================
// Login Component
// ======================================================
// User login with validation, CAPTCHA, and error handling
// ======================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captcha: ''
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Alert state
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  // CAPTCHA state
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  
  // Generate simple math CAPTCHA
  useEffect(() => {
    generateCaptcha();
  }, []);
  
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
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
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // CAPTCHA validation
    if (!formData.captcha) {
      newErrors.captcha = 'Please solve the CAPTCHA';
    } else if (parseInt(formData.captcha) !== captchaQuestion.answer) {
      newErrors.captcha = 'Incorrect CAPTCHA answer';
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
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store token and user info
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('user_info', JSON.stringify(data.data.user));
        
        // Show success message
        setAlert({ show: true, message: 'Login successful! Redirecting...', type: 'success' });
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        // Handle specific error cases
        if (data.requires_verification) {
          setAlert({ 
            show: true, 
            message: data.message + ' Redirecting to verification...', 
            type: 'warning' 
          });
          
          setTimeout(() => {
            navigate('/verify-otp', { state: { email: formData.email } });
          }, 2000);
        } else {
          setAlert({ show: true, message: data.message, type: 'error' });
        }
        
        // Regenerate CAPTCHA on failed login
        generateCaptcha();
        setFormData(prev => ({ ...prev, captcha: '' }));
      }
    } catch (error) {
      console.error('Login error:', error);
      setAlert({ 
        show: true, 
        message: 'Network error. Please check your connection and try again.', 
        type: 'error' 
      });
      
      // Regenerate CAPTCHA
      generateCaptcha();
      setFormData(prev => ({ ...prev, captcha: '' }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🎓 University Management</h1>
          <h2>Login</h2>
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
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          {/* CAPTCHA */}
          <div className="form-group">
            <label htmlFor="captcha">
              Security Check <span className="required">*</span>
            </label>
            <div className="captcha-box">
              <span className="captcha-question">
                What is {captchaQuestion.num1} + {captchaQuestion.num2}?
              </span>
              <button 
                type="button" 
                onClick={generateCaptcha}
                className="captcha-refresh"
                disabled={isSubmitting}
              >
                🔄
              </button>
            </div>
            <input
              type="number"
              id="captcha"
              name="captcha"
              value={formData.captcha}
              onChange={handleChange}
              className={errors.captcha ? 'error' : ''}
              placeholder="Enter answer"
              disabled={isSubmitting}
            />
            {errors.captcha && <span className="error-message">{errors.captcha}</span>}
          </div>
          
          {/* Forgot Password Link */}
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
          
          {/* Register Link */}
          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
