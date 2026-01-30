// ======================================================
// MySQL Database Configuration for XAMPP
// ======================================================
// This file provides MySQL database connection for XAMPP
// ======================================================

const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'university_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

// Create connection pool
let pool;

async function initializeConnection() {
  try {
    // First, connect without database to create it if needed
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });

    // Create database if it doesn't exist
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await tempConnection.query(`USE ${dbConfig.database}`);
    await tempConnection.end();

    // Create connection pool
    pool = mysql.createPool(dbConfig);

    console.log('✅ Connected to MySQL database (XAMPP):', dbConfig.database);
    
    // Initialize tables
    await initializeDatabase();
    
    // Seed initial data
    await seedData();

    return pool;
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    throw error;
  }
}

// ======================================================
// Create Tables
// ======================================================

async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'pending',
        department VARCHAR(100),
        designation VARCHAR(100),
        batch VARCHAR(20),
        studentId VARCHAR(50),
        is_verified TINYINT(1) DEFAULT 0,
        otp VARCHAR(10),
        otp_expiry DATETIME,
        reset_token VARCHAR(255),
        reset_token_expiry DATETIME,
        failed_login_attempts INT DEFAULT 0,
        last_failed_login DATETIME,
        account_locked_until DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      )
    `);

    // Login attempts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45),
        success TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_created_at (created_at)
      )
    `);

    // Routines table
    await connection.query(`
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
      )
    `);

    // Research papers table
    await connection.query(`
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
      )
    `);

    // Hostel students table
    await connection.query(`
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
      )
    `);

    // Departments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        code VARCHAR(20) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Teachers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        designation VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        specialization TEXT,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_department (department),
        INDEX idx_name (name)
      )
    `);

    // Activity logs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        action VARCHAR(50) NOT NULL,
        entity VARCHAR(50) NOT NULL,
        entity_id INT,
        details TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_action (action),
        INDEX idx_entity (entity),
        INDEX idx_created_at (created_at),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    connection.release();
    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  }
}

// ======================================================
// Seed Initial Data
// ======================================================

async function seedData() {
  try {
    const connection = await pool.getConnection();

    // Check if users already exist
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    
    if (users[0].count > 0) {
      console.log('✅ Database already contains data, skipping seed');
      connection.release();
      return;
    }

    console.log('🌱 Seeding initial data...');

    const bcrypt = require('bcryptjs');

    // Insert admin user
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    await connection.query(`
      INSERT INTO users (full_name, email, password_hash, role, is_verified, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, ['System Admin', 'admin@university.edu', adminPassword, 'admin', 1]);

    // Insert sample faculty user
    const facultyPassword = await bcrypt.hash('Faculty@123', 10);
    await connection.query(`
      INSERT INTO users (full_name, email, password_hash, role, department, designation, is_verified, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `, ['Dr. John Smith', 'faculty@university.edu', facultyPassword, 'faculty', 'Computer Science', 'Professor', 1]);

    // Insert sample student user
    const studentPassword = await bcrypt.hash('Student@123', 10);
    await connection.query(`
      INSERT INTO users (full_name, email, password_hash, role, department, batch, studentId, is_verified, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, ['Jane Doe', 'student@university.edu', studentPassword, 'student', 'Computer Science', 'D-78A', 'CS2024001', 1]);

    // Seed departments
    await seedDepartments(connection);

    // Seed teachers
    await seedTeachers(connection);

    connection.release();
    console.log('✅ Initial data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  }
}

async function seedDepartments(connection) {
  const { allDepartments } = require('../data/departments');
  
  for (const dept of allDepartments) {
    try {
      await connection.query(`
        INSERT IGNORE INTO departments (name, code, description)
        VALUES (?, ?, ?)
      `, [dept.name, dept.code, `${dept.name}`]);
    } catch (error) {
      // Ignore duplicate errors
    }
  }
}

async function seedTeachers(connection) {
  const teacherFiles = [
    '../data/cseTeachers',
    '../data/eeeTeachers',
    '../data/civilTeachers',
    '../data/bbaTeachers',
    '../data/bmbTeachers',
    '../data/lawTeachers',
    '../data/englishTeachers',
    '../data/economicsTeachers',
    '../data/politicalScienceTeachers',
    '../data/sociologyTeachers',
    '../data/developmentStudiesTeachers',
    '../data/microbiologyTeachers',
    '../data/pharmacyTeachers'
  ];

  for (const file of teacherFiles) {
    try {
      const teachers = require(file);
      for (const teacher of teachers) {
        try {
          await connection.query(`
            INSERT IGNORE INTO teachers (name, designation, department, email, phone, specialization, image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            teacher.name,
            teacher.designation,
            teacher.department,
            teacher.email || null,
            teacher.phone || null,
            teacher.specialization || null,
            teacher.image || null
          ]);
        } catch (error) {
          // Ignore individual insert errors
        }
      }
    } catch (error) {
      // File might not exist
    }
  }
}

// ======================================================
// Query Helper (compatible with existing code)
// ======================================================

let isInitialized = false;
let initPromise = null;

const db = {
  query: async (sql, params) => {
    try {
      // Wait for initialization if not done
      if (!isInitialized) {
        await initPromise;
      }
      const [rows, fields] = await pool.query(sql, params);
      return [rows, fields];
    } catch (error) {
      console.error('Query error:', error.message);
      throw error;
    }
  },
  
  getConnection: async () => {
    // Wait for initialization if not done
    if (!isInitialized) {
      await initPromise;
    }
    return await pool.getConnection();
  },

  // For backwards compatibility
  execute: async (sql, params) => {
    // Wait for initialization if not done
    if (!isInitialized) {
      await initPromise;
    }
    return await pool.query(sql, params);
  }
};

// Initialize connection
initPromise = initializeConnection()
  .then(() => {
    isInitialized = true;
    console.log('✅ Database initialization completed');
  })
  .catch((error) => {
    console.error('❌ Failed to initialize database:', error.message);
    console.error('Stack:', error.stack);
    // Don't exit, let the app continue
    isInitialized = false;
  });

module.exports = db;
