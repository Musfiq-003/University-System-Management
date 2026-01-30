-- ======================================================
-- Authentication Tables for University Management System
-- ======================================================

-- Users table with authentication and verification fields
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student', 'faculty') NOT NULL DEFAULT 'student',
  is_verified BOOLEAN DEFAULT FALSE,
  otp VARCHAR(6) NULL,
  otp_expiry DATETIME NULL,
  reset_token VARCHAR(255) NULL,
  reset_token_expiry DATETIME NULL,
  failed_login_attempts INT DEFAULT 0,
  last_failed_login DATETIME NULL,
  account_locked_until DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_reset_token (reset_token)
);

-- Session tokens table (alternative to JWT for longer sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id)
);

-- Login attempts tracking table
CREATE TABLE IF NOT EXISTS login_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NULL,
  success BOOLEAN DEFAULT FALSE,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_attempted_at (attempted_at)
);

-- Sample admin user (password: Admin@123)
-- Note: This is just an example, password will be hashed by the application
INSERT INTO users (full_name, email, password_hash, role, is_verified) 
VALUES ('System Admin', 'admin@university.edu', '$2a$10$example_hash', 'admin', TRUE)
ON DUPLICATE KEY UPDATE email=email;
