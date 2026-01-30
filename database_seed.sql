-- ======================================================
-- University Management System - Seed Data
-- ======================================================
-- This file contains initial data for the database
-- Run this after creating the database schema
-- ======================================================

USE university_management;

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM login_attempts;
-- DELETE FROM sessions;
-- DELETE FROM hostel_students;
-- DELETE FROM research_papers;
-- DELETE FROM routines;
-- DELETE FROM users;

-- ======================================================
-- SEED USERS
-- ======================================================

-- Admin User
INSERT INTO users (id, full_name, email, password_hash, role, is_verified, created_at) VALUES
(1, 'System Admin', 'admin@university.edu', '$2b$10$MuFjuv6MFgAjHjVbHx6ZCuj12dxCqh7dyc4dPJhwUMzEeQKkRm5bC', 'admin', TRUE, '2025-01-15 00:00:00')
ON DUPLICATE KEY UPDATE email=email;

-- Faculty Users
INSERT INTO users (id, full_name, email, password_hash, role, is_verified, created_at) VALUES
(2, 'Prof. Dr. Md. Abdul Based', 'based123@gmail.com', '$2b$10$X/JKX8i5zKtRnVBq9zwwReJLY8hDdn77C8occLfU9R4LHZS1zp1E.', 'faculty', TRUE, '2025-02-10 00:00:00'),
(3, 'Dr. Shameem Ahmed', 'shahmeem.cse@diu.ac', '$2b$10$X/JKX8i5zKtRnVBq9zwwReJLY8hDdn77C8occLfU9R4LHZS1zp1E.', 'faculty', TRUE, '2025-03-05 00:00:00'),
(7, 'Ms. Sraboni Barua', 'baruasraboni@yahoo.com', '$2b$10$X/JKX8i5zKtRnVBq9zwwReJLY8hDdn77C8occLfU9R4LHZS1zp1E.', 'faculty', TRUE, '2025-07-15 00:00:00')
ON DUPLICATE KEY UPDATE email=email;

-- Student Users
INSERT INTO users (id, full_name, email, password_hash, role, is_verified, created_at) VALUES
(4, 'Ahmed Hassan', 'ahmed.hassan@student.diu.ac', '$2b$10$8.g9Uu2jepxVnsHKFCgeZOqp1ZaPWmrK39mNXS09Md1tbWgQn1hS2', 'student', TRUE, '2025-04-20 00:00:00'),
(5, 'Fatima Rahman', 'fatima.rahman@student.diu.ac', '$2b$10$8.g9Uu2jepxVnsHKFCgeZOqp1ZaPWmrK39mNXS09Md1tbWgQn1hS2', 'student', TRUE, '2025-05-12 00:00:00'),
(6, 'Karim Abdullah', 'karim.abdullah@student.diu.ac', '$2b$10$8.g9Uu2jepxVnsHKFCgeZOqp1ZaPWmrK39mNXS09Md1tbWgQn1hS2', 'student', TRUE, '2025-06-08 00:00:00')
ON DUPLICATE KEY UPDATE email=email;

-- Pending Users (awaiting role assignment)
INSERT INTO users (id, full_name, email, password_hash, role, is_verified, created_at) VALUES
(8, 'Nusrat Jahan', 'nusrat.jahan@student.diu.ac', '$2b$10$8.g9Uu2jepxVnsHKFCgeZOqp1ZaPWmrK39mNXS09Md1tbWgQn1hS2', 'student', TRUE, '2025-12-20 00:00:00'),
(9, 'Mehedi Hasan', 'mehedi.hasan@student.diu.ac', '$2b$10$8.g9Uu2jepxVnsHKFCgeZOqp1ZaPWmrK39mNXS09Md1tbWgQn1hS2', 'student', TRUE, '2025-12-22 00:00:00')
ON DUPLICATE KEY UPDATE email=email;

-- ======================================================
-- PASSWORDS REFERENCE (for testing)
-- ======================================================
-- Admin: Admin@123
-- Faculty: Faculty@123
-- Students: Student@123
-- ======================================================

-- Reset auto increment counter
ALTER TABLE users AUTO_INCREMENT = 10;

-- ======================================================
-- SAMPLE ROUTINES (Optional)
-- ======================================================

INSERT INTO routines (course, teacher, department, day, start_time, end_time, batch) VALUES
('Database Systems', 'Dr. Shameem Ahmed', 'Computer Science & Engineering', 'Monday', '09:00:00', '10:30:00', 'D-78A'),
('Web Development', 'Prof. Dr. Md. Abdul Based', 'Computer Science & Engineering', 'Tuesday', '11:00:00', '12:30:00', 'D-78A'),
('Data Structures', 'Ms. Sraboni Barua', 'Computer Science & Engineering', 'Wednesday', '14:00:00', '15:30:00', 'D-78A'),
('Operating Systems', 'Dr. Shameem Ahmed', 'Computer Science & Engineering', 'Thursday', '09:00:00', '10:30:00', 'D-78B'),
('Computer Networks', 'Prof. Dr. Md. Abdul Based', 'Computer Science & Engineering', 'Friday', '11:00:00', '12:30:00', 'D-78B')
ON DUPLICATE KEY UPDATE course=course;

-- ======================================================
-- SAMPLE RESEARCH PAPERS (Optional)
-- ======================================================

INSERT INTO research_papers (title, author, department, year, status) VALUES
('Machine Learning in Healthcare', 'Prof. Dr. Md. Abdul Based', 'Computer Science & Engineering', 2024, 'Published'),
('Blockchain Technology in Education', 'Dr. Shameem Ahmed', 'Computer Science & Engineering', 2023, 'Under Review'),
('AI-Driven Student Assessment', 'Ms. Sraboni Barua', 'Computer Science & Engineering', 2024, 'Draft'),
('Cloud Computing Security', 'Prof. Dr. Md. Abdul Based', 'Computer Science & Engineering', 2024, 'Published')
ON DUPLICATE KEY UPDATE title=title;

-- ======================================================
-- SAMPLE HOSTEL ALLOCATIONS (Optional)
-- ======================================================

INSERT INTO hostel_students (student_name, student_id, hostel_name, room_number, department, allocated_date) VALUES
('Ahmed Hassan', 'CS2024001', 'North Hall', '101', 'Computer Science & Engineering', '2024-01-15'),
('Fatima Rahman', 'CS2024002', 'South Hall', '205', 'Computer Science & Engineering', '2024-01-16'),
('Karim Abdullah', 'EEE2024001', 'East Hall', '310', 'Electrical & Electronic Engineering', '2024-01-17')
ON DUPLICATE KEY UPDATE student_name=student_name;

-- ======================================================
-- DATABASE SETUP COMPLETE
-- ======================================================

SELECT 'Database seeded successfully!' AS message;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_routines FROM routines;
SELECT COUNT(*) AS total_research FROM research_papers;
SELECT COUNT(*) AS total_hostel FROM hostel_students;
