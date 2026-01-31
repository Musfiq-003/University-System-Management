// ======================================================
// Register Component
// ======================================================
// User registration with password strength meter,
// validation, and CAPTCHA protection
// ======================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Register() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    role: 'student', // Default to student
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    studentId: '',
    department: '',
    batch: '',
    designation: '', // For faculty
    gender: '',
    date_of_birth: '',
    address: '',
    phone_number: '',
    captcha: ''
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

  // Alert state
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // CAPTCHA state
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });

  // Generate CAPTCHA on mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Check password strength whenever password changes
  useEffect(() => {
    checkPasswordStrength(formData.password);
  }, [formData.password]);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
  };

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

    // Full name validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const { requirements } = passwordStrength;
      if (!requirements.length) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!requirements.uppercase) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!requirements.lowercase) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!requirements.number) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!requirements.special) {
        newErrors.password = 'Password must contain at least one special character';
      }
    }

    // Confirm password validation
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    // Role validation removed as it is handled by backend

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
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: formData.role,
          full_name: formData.full_name.trim(),
          email: formData.email.toLowerCase(),
          password: formData.password,
          studentId: formData.studentId,
          department: formData.department,
          batch: formData.batch,
          designation: formData.designation,
          gender: formData.gender,
          date_of_birth: formData.date_of_birth,
          address: formData.address,
          phone_number: formData.phone_number
        })
      });

      const data = await response.json();

      if (data.success) {
        setAlert({
          show: true,
          message: 'Registration successful! Redirecting to login...',
          type: 'success'
        });

        // Redirect to Login page after short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          setAlert({
            show: true,
            message: data.errors.join('. '),
            type: 'error'
          });
        } else {
          setAlert({ show: true, message: data.message, type: 'error' });
        }

        // Regenerate CAPTCHA
        generateCaptcha();
        setFormData(prev => ({ ...prev, captcha: '' }));
      }
    } catch (error) {
      console.error('Registration error:', error);
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
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1>🎓 University Management</h1>
          <h2>Create Account</h2>
        </div>

        {alert.show && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role Selection */}
          <div className="form-group">
            <label htmlFor="role">Register As <span className="required">*</span></label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
              style={{ borderColor: '#667eea', borderWidth: '2px' }}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty (Teacher)</option>
            </select>
          </div>

          {/* Full Name Field */}
          <div className="form-group">
            <label htmlFor="full_name">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={errors.full_name ? 'error' : ''}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
            {errors.full_name && <span className="error-message">{errors.full_name}</span>}
          </div>

          {/* Grid for Specific Details */}
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

            {/* Conditional Fields for Student */}
            {formData.role === 'student' && (
              <>
                <div className="form-group">
                  <label htmlFor="studentId">Student ID <span className="required">*</span></label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="e.g. CS2024001"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="batch">Batch <span className="required">*</span></label>
                  <input
                    type="text"
                    id="batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    placeholder="e.g. Batch-91"
                  />
                </div>
              </>
            )}

            {/* Conditional Fields for Faculty */}
            {formData.role === 'faculty' && (
              <div className="form-group">
                <label htmlFor="designation">Designation <span className="required">*</span></label>
                <select
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Designation</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Professor">Professor</option>
                </select>
              </div>
            )}

            {/* Department (Common) */}
            <div className="form-group">
              <label htmlFor="department">Department <span className="required">*</span></label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Department</option>
                <option value="Computer Science & Engineering">CSE</option>
                <option value="Electrical Engineering">EEE</option>
                <option value="BBA">BBA</option>
                <option value="English">English</option>
              </select>
            </div>

            {/* Gender (Common) */}
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth (Common) */}
            <div className="form-group">
              <label htmlFor="date_of_birth">Date of Birth</label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>

            {/* Phone Number (Common) */}
            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+880..."
              />
            </div>
          </div>

          {/* Address - Full Width */}
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your full address"
              rows="2"
              className="form-textarea"
            ></textarea>
          </div>

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

          {/* Password Field with Strength Meter */}
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
              placeholder="Create a strong password"
              disabled={isSubmitting}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}

            {/* Password Strength Indicator */}
            {formData.password && (
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
              Confirm Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className={errors.confirm_password ? 'error' : ''}
              placeholder="Re-enter your password"
              disabled={isSubmitting}
            />
            {errors.confirm_password && <span className="error-message">{errors.confirm_password}</span>}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || passwordStrength.score < 3}
          >
            {isSubmitting ? 'Creating Account...' : 'Register'}
          </button>

          {/* Login Link */}
          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
