-- ======================================================
-- University Management System Database Schema
-- ======================================================
-- This file contains all the table definitions for the
-- University Management System
-- ======================================================

-- Create the database
CREATE DATABASE IF NOT EXISTS university_management;
USE university_management;

-- ======================================================
-- Table: routines
-- Purpose: Store class routine information
-- ======================================================
CREATE TABLE IF NOT EXISTS routines (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course VARCHAR(100) NOT NULL,
  teacher VARCHAR(100) NOT NULL,
  department VARCHAR(50) NOT NULL,
  day VARCHAR(20),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  batch VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_day (day),
  INDEX idx_course (course),
  INDEX idx_batch (batch),
  INDEX idx_department (department)
);

-- ======================================================
-- Table: research_papers
-- Purpose: Store research paper information
-- ======================================================
CREATE TABLE IF NOT EXISTS research_papers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_department (department),
  INDEX idx_year (year),
  INDEX idx_status (status)
);

-- ======================================================
-- Table: hostel_students
-- Purpose: Store hostel student allocation information
-- ======================================================
CREATE TABLE IF NOT EXISTS hostel_students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_name VARCHAR(100) NOT NULL,
  student_id VARCHAR(50) NOT NULL UNIQUE,
  hostel_name VARCHAR(100) NOT NULL,
  room_number VARCHAR(20) NOT NULL,
  department VARCHAR(100) NOT NULL,
  allocated_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_hostel (hostel_name),
  INDEX idx_student_id (student_id)
);

-- ======================================================
-- Sample Data (Optional - for testing)
-- ======================================================

-- Sample routines
INSERT INTO routines (course, teacher, day, start_time, end_time, batch) VALUES
('Database Systems', 'Dr. John Smith', 'Monday', '09:00:00', '10:30:00', 'D-78A'),
('Web Development', 'Prof. Sarah Johnson', 'Tuesday', '11:00:00', '12:30:00', 'D-78B'),
('Data Structures', 'Dr. Mike Wilson', 'Wednesday', '14:00:00', '15:30:00', 'E-100');

-- Sample research papers
INSERT INTO research_papers (title, author, department, year, status) VALUES
('Machine Learning in Healthcare', 'Dr. Alice Brown', 'Computer Science', 2024, 'Published'),
('Renewable Energy Solutions', 'Prof. Robert Davis', 'Engineering', 2023, 'Under Review'),
('Climate Change Impact', 'Dr. Emily White', 'Environmental Science', 2024, 'Draft');

-- Sample hostel allocations
INSERT INTO hostel_students (student_name, student_id, hostel_name, room_number, department, allocated_date) VALUES
('John Doe', 'CS2024001', 'North Hall', '101', 'Computer Science', '2024-01-15'),
('Jane Smith', 'EE2024002', 'South Hall', '205', 'Electrical Engineering', '2024-01-16'),
('Bob Johnson', 'ME2024003', 'East Hall', '310', 'Mechanical Engineering', '2024-01-17');
