-- ======================================================
-- University Management System - Complete MySQL Schema
-- ======================================================
-- For XAMPP / phpMyAdmin
-- This file creates all tables with proper indexes, constraints, and relationships
-- ======================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS university_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE university_management;

-- Drop existing tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS login_attempts;
DROP TABLE IF EXISTS hostel_students;
DROP TABLE IF EXISTS research_papers;
DROP TABLE IF EXISTS routines;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

-- ======================================================
-- USERS TABLE
-- ======================================================
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('pending', 'student', 'faculty', 'admin') NOT NULL DEFAULT 'pending',
  department VARCHAR(100) NULL,
  designation VARCHAR(100) NULL,
  batch VARCHAR(20) NULL,
  studentId VARCHAR(50) NULL,
  is_verified TINYINT(1) DEFAULT 0,
  otp VARCHAR(10) NULL,
  otp_expiry DATETIME NULL,
  reset_token VARCHAR(255) NULL,
  reset_token_expiry DATETIME NULL,
  failed_login_attempts INT DEFAULT 0,
  last_failed_login DATETIME NULL,
  account_locked_until DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_department (department),
  INDEX idx_batch (batch),
  INDEX idx_studentId (studentId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- LOGIN ATTEMPTS TABLE
-- ======================================================
CREATE TABLE login_attempts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NULL,
  success TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at),
  INDEX idx_ip_address (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- DEPARTMENTS TABLE
-- ======================================================
CREATE TABLE departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- TEACHERS TABLE
-- ======================================================
CREATE TABLE teachers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(20) NULL,
  specialization TEXT NULL,
  image VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_department (department),
  INDEX idx_name (name),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- ROUTINES TABLE
-- ======================================================
CREATE TABLE routines (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course VARCHAR(100) NOT NULL,
  teacher VARCHAR(100) NOT NULL,
  department VARCHAR(50) NOT NULL,
  day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  batch VARCHAR(20) NOT NULL,
  room_number VARCHAR(20) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_day (day),
  INDEX idx_course (course),
  INDEX idx_batch (batch),
  INDEX idx_department (department),
  INDEX idx_teacher (teacher)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- RESEARCH PAPERS TABLE
-- ======================================================
CREATE TABLE research_papers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  status ENUM('Draft', 'Under Review', 'Published', 'Rejected') NOT NULL DEFAULT 'Draft',
  abstract TEXT NULL,
  keywords TEXT NULL,
  file_path VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_department (department),
  INDEX idx_year (year),
  INDEX idx_status (status),
  INDEX idx_author (author)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- HOSTEL STUDENTS TABLE
-- ======================================================
CREATE TABLE hostel_students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_name VARCHAR(100) NOT NULL,
  student_id VARCHAR(50) NOT NULL UNIQUE,
  hostel_name VARCHAR(100) NOT NULL,
  room_number VARCHAR(20) NOT NULL,
  department VARCHAR(100) NOT NULL,
  allocated_date DATE NOT NULL,
  check_in_date DATE NULL,
  check_out_date DATE NULL,
  status ENUM('Active', 'Inactive', 'Transferred') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_hostel (hostel_name),
  INDEX idx_student_id (student_id),
  INDEX idx_department (department),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- ACTIVITY LOGS TABLE
-- ======================================================
CREATE TABLE activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  action VARCHAR(50) NOT NULL COMMENT 'CREATE, UPDATE, DELETE, READ, LOGIN, LOGOUT',
  entity VARCHAR(50) NOT NULL COMMENT 'USER, ROUTINE, RESEARCH_PAPER, HOSTEL, etc.',
  entity_id INT NULL,
  details TEXT NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_entity (entity),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- NOTICES TABLE
-- ======================================================
CREATE TABLE notices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NULL,
  publish_date DATE NULL,
  target_audience ENUM('all', 'students', 'faculty') DEFAULT 'all',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- STUDENT ACCOUNTS TABLE
-- ======================================================
CREATE TABLE student_accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  studentId VARCHAR(50) NOT NULL UNIQUE,
  payable DECIMAL(10,2) DEFAULT 0.00,
  paid DECIMAL(10,2) DEFAULT 0.00,
  due DECIMAL(10,2) GENERATED ALWAYS AS (payable - paid) STORED,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_studentId (studentId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- STUDENT RESULTS TABLE
-- ======================================================
CREATE TABLE student_results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  studentId VARCHAR(50) NOT NULL UNIQUE,
  cgpa DECIMAL(3,2) DEFAULT 0.00,
  credits_completed DECIMAL(5,1) DEFAULT 0.0,
  total_credits_required DECIMAL(5,1) DEFAULT 140.0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_studentId (studentId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- PAYMENT HISTORY TABLE
-- ======================================================
CREATE TABLE payment_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  studentId VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_reason VARCHAR(100) NOT NULL COMMENT 'e.g. Tuition Fee, Hostel Fee, Semester Fee',
  payment_method VARCHAR(50) DEFAULT 'Cash' COMMENT 'e.g. Cash, Bank Transfer, Bkash, Online',
  transaction_reference VARCHAR(100) NULL COMMENT 'Bank Trx ID or Mobile Banking Trx ID',
  status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
  remarks TEXT NULL,
  INDEX idx_student_payment (studentId),
  INDEX idx_payment_date (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- INSERT DEFAULT DATA
-- ======================================================

-- Insert default admin user (password: Admin@123)
INSERT INTO users (full_name, email, password_hash, role, is_verified) VALUES
('System Administrator', 'admin@university.edu', '$2b$10$MuFjuv6MFgAjHjVbHx6ZCuj12dxCqh7dyc4dPJhwUMzEeQKkRm5bC', 'admin', 1);

-- Insert sample faculty user (password: Faculty@123)
INSERT INTO users (full_name, email, password_hash, role, department, designation, is_verified) VALUES
('Dr. John Smith', 'faculty@university.edu', '$2b$10$X/JKX8i5zKtRnVBq9zwwReJLY8hDdn77C8occLfU9R4LHZS1zp1E.', 'faculty', 'Computer Science & Engineering', 'Professor', 1);

-- Insert sample student user (password: Student@123)
INSERT INTO users (full_name, email, password_hash, role, department, batch, studentId, is_verified) VALUES
('Jane Doe', 'student@university.edu', '$2b$10$8.g9Uu2jepxVnsHKFCgeZOqp1ZaPWmrK39mNXS09Md1tbWgQn1hS2', 'student', 'Computer Science & Engineering', 'D-78A', 'CS2024001', 1);

-- Insert departments
INSERT INTO departments (name, code, description) VALUES
('Computer Science & Engineering', 'CSE', 'Department of Computer Science and Engineering'),
('Electrical & Electronic Engineering', 'EEE', 'Department of Electrical and Electronic Engineering'),
('Civil Engineering', 'CE', 'Department of Civil Engineering'),
('Business Administration', 'BBA', 'Department of Business Administration'),
('Biochemistry and Molecular Biology', 'BMB', 'Department of Biochemistry and Molecular Biology'),
('English', 'ENG', 'Department of English'),
('Law', 'LAW', 'Department of Law and Justice'),
('Pharmacy', 'PHM', 'Department of Pharmacy'),
('Microbiology', 'MCB', 'Department of Microbiology'),
('Sociology', 'SOC', 'Department of Sociology'),
('Political Science', 'PS', 'Department of Political Science'),
('Economics', 'ECO', 'Department of Economics'),
('Development Studies', 'DS', 'Department of Development Studies');

-- Insert sample routines
INSERT INTO routines (course, teacher, department, day, start_time, end_time, batch, room_number) VALUES
('Database Management Systems', 'Dr. John Smith', 'Computer Science & Engineering', 'Monday', '09:00:00', '10:30:00', 'D-78A', 'Room 301'),
('Web Development', 'Prof. Sarah Johnson', 'Computer Science & Engineering', 'Tuesday', '11:00:00', '12:30:00', 'D-78B', 'Room 305'),
('Data Structures', 'Dr. Mike Wilson', 'Computer Science & Engineering', 'Wednesday', '14:00:00', '15:30:00', 'D-78A', 'Room 302'),
('Algorithms', 'Dr. Emily Brown', 'Computer Science & Engineering', 'Thursday', '10:00:00', '11:30:00', 'D-78A', 'Room 303');

-- Insert sample research papers
INSERT INTO research_papers (title, author, department, year, status, abstract) VALUES
('Machine Learning in Healthcare', 'Dr. Alice Brown', 'Computer Science & Engineering', 2024, 'Published', 'This paper explores the application of machine learning algorithms in healthcare systems.'),
('Renewable Energy Solutions', 'Prof. Robert Davis', 'Electrical & Electronic Engineering', 2023, 'Under Review', 'A comprehensive study on sustainable energy alternatives.'),
('Climate Change Impact Analysis', 'Dr. Emily White', 'Environmental Science', 2024, 'Draft', 'An in-depth analysis of climate change effects on ecosystems.');

-- Insert sample hostel students
INSERT INTO hostel_students (student_name, student_id, hostel_name, room_number, department, allocated_date, status) VALUES
('Ahmed Hassan', 'CS2024001', 'North Hall', '101', 'Computer Science & Engineering', '2024-01-15', 'Active'),
('Fatima Rahman', 'CS2024002', 'South Hall', '205', 'Computer Science & Engineering', '2024-01-16', 'Active'),
('Karim Abdullah', 'EEE2024001', 'East Hall', '310', 'Electrical & Electronic Engineering', '2024-01-17', 'Active');

-- ======================================================
-- USEFUL VIEWS FOR REPORTING
-- ======================================================

-- View: Active users with their latest login
CREATE OR REPLACE VIEW v_active_users AS
SELECT 
  u.id,
  u.full_name,
  u.email,
  u.role,
  u.department,
  u.is_verified,
  MAX(la.created_at) as last_login
FROM users u
LEFT JOIN login_attempts la ON u.email = la.email AND la.success = 1
WHERE u.is_verified = 1
GROUP BY u.id, u.full_name, u.email, u.role, u.department, u.is_verified;

-- View: Daily activity summary
CREATE OR REPLACE VIEW v_daily_activity_stats AS
SELECT 
  DATE(created_at) as activity_date,
  action,
  entity,
  COUNT(*) as count
FROM activity_logs
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(created_at), action, entity
ORDER BY activity_date DESC, count DESC;

-- ======================================================
-- STORED PROCEDURES FOR COMMON OPERATIONS
-- ======================================================

DELIMITER $$

-- Procedure: Get user dashboard statistics
CREATE PROCEDURE sp_get_user_stats(IN p_user_id INT)
BEGIN
  SELECT 
    (SELECT COUNT(*) FROM routines WHERE department = u.department) as routine_count,
    (SELECT COUNT(*) FROM research_papers WHERE department = u.department) as paper_count,
    (SELECT COUNT(*) FROM hostel_students WHERE department = u.department) as hostel_count,
    (SELECT COUNT(*) FROM activity_logs WHERE user_id = p_user_id) as activity_count
  FROM users u
  WHERE u.id = p_user_id;
END$$

-- Procedure: Cleanup old activity logs
CREATE PROCEDURE sp_cleanup_old_logs(IN days_to_keep INT)
BEGIN
  DELETE FROM activity_logs 
  WHERE created_at < DATE_SUB(NOW(), INTERVAL days_to_keep DAY);
  
  SELECT ROW_COUNT() as deleted_count;
END$$

DELIMITER ;

-- ======================================================
-- TRIGGERS FOR AUDIT TRAIL
-- ======================================================

-- Trigger: Log user updates
DELIMITER $$

CREATE TRIGGER trg_user_update_log
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  IF NEW.role != OLD.role THEN
    INSERT INTO activity_logs (user_id, action, entity, entity_id, details)
    VALUES (NEW.id, 'UPDATE', 'USER', NEW.id, CONCAT('Role changed from ', OLD.role, ' to ', NEW.role));
  END IF;
END$$

DELIMITER ;

-- ======================================================
-- GRANT PERMISSIONS (Optional - for specific users)
-- ======================================================

-- GRANT ALL PRIVILEGES ON university_management.* TO 'university_user'@'localhost' IDENTIFIED BY 'strong_password_here';
-- FLUSH PRIVILEGES;

-- ======================================================
-- DATABASE SETUP COMPLETE
-- ======================================================

SELECT '✅ Database schema created successfully!' as Status;
SELECT CONCAT('Total tables created: ', COUNT(*)) as Info FROM information_schema.tables WHERE table_schema = 'university_management';
