// ======================================================
// SQLite Database Configuration
// ======================================================
// File-based database for persistent data storage
// ======================================================

const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Create database file in project root
const dbPath = path.join(__dirname, '..', 'university.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('📊 Connected to SQLite database:', dbPath);

// ======================================================
// Create Tables
// ======================================================

function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'pending',
      department TEXT,
      designation TEXT,
      batch TEXT,
      studentId TEXT,
      is_verified INTEGER DEFAULT 0,
      otp TEXT,
      otp_expiry DATETIME,
      reset_token TEXT,
      reset_token_expiry DATETIME,
      failed_login_attempts INTEGER DEFAULT 0,
      last_failed_login DATETIME,
      account_locked_until DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Login attempts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      ip_address TEXT,
      success INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Routines table - DIU Format
  db.exec(`
    CREATE TABLE IF NOT EXISTS routines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      department TEXT NOT NULL,
      batch TEXT NOT NULL,
      semester TEXT NOT NULL,
      shift TEXT NOT NULL,
      students_count INTEGER,
      room_number TEXT,
      counselor_name TEXT,
      counselor_contact TEXT,
      courses TEXT NOT NULL,
      time_slots TEXT NOT NULL,
      academic_year TEXT,
      effective_from DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Research papers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS research_papers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      department TEXT NOT NULL,
      year INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'Draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Hostel students table
  db.exec(`
    CREATE TABLE IF NOT EXISTS hostel_students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      student_id TEXT NOT NULL UNIQUE,
      hostel_name TEXT NOT NULL,
      room_number TEXT NOT NULL,
      department TEXT NOT NULL,
      allocated_date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Departments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      code TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Teachers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      department TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      specialization TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Database tables created successfully');
}

// ======================================================
// Seed Initial Data
// ======================================================

function seedData() {
  try {
    // Check if users already exist
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    
    if (userCount.count > 0) {
      console.log('✅ Database already contains data, skipping seed');
      return;
    }

    console.log('🌱 Seeding initial data...');

    // Insert users with hashed passwords
    const insertUser = db.prepare(`
      INSERT INTO users (full_name, email, password_hash, role, department, designation, batch, studentId, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const users = [
      ['System Admin', 'admin@university.edu', '$2b$10$MuFjuv6MFgAjHjVbHx6ZCuj12dxCqh7dyc4dPJhwUMzEeQKkRm5bC', 'admin', null, null, null, null, 1],
      ['Prof. Dr. Md. Abdul Based', 'based123@gmail.com', '$2b$10$X/JKX8i5zKtRnVBq9zwwReJLY8hDdn77C8occLfU9R4LHZS1zp1E.', 'faculty', 'Computer Science & Engineering', 'Professor', null, null, 1],
      ['Dr. Shameem Ahmed', 'shahmeem.cse@diu.ac', '$2b$10$X/JKX8i5zKtRnVBq9zwwReJLY8hDdn77C8occLfU9R4LHZS1zp1E.', 'faculty', 'Computer Science & Engineering', 'Associate Professor', null, null, 1],
      ['Ahmed Hassan', 'ahmed.hassan@student.diu.ac', '$2b$10$8.g9Uu2jepxVnsHKFCgeZOqp1ZaPWmrK39mNXS09Md1tbWgQn1hS2', 'student', 'Computer Science & Engineering', null, 'D-78A', 'CS2024001', 1],
      ['Fatima Rahman', 'fatima.rahman@student.diu.ac', '$2b$10$8.g9Uu2jepxVnsHKFCgeZOqp1ZaPWmrK39mNXS09Md1tbWgQn1hS2', 'student', 'Computer Science & Engineering', null, 'D-78A', 'CS2024002', 1],
      ['Karim Abdullah', 'karim.abdullah@student.diu.ac', '$2b$10$8.g9Uu2jepxVnsHKFCgeZOqp1ZaPWmrK39mNXS09Md1tbWgQn1hS2', 'student', 'Electrical & Electronic Engineering', null, 'E-100', 'EEE2024001', 1],
      ['Ms. Sraboni Barua', 'baruasraboni@yahoo.com', '$2b$10$X/JKX8i5zKtRnVBq9zwwReJLY8hDdn77C8occLfU9R4LHZS1zp1E.', 'faculty', 'Computer Science & Engineering', 'Lecturer', null, null, 1]
    ];

    const insertMany = db.transaction((users) => {
      for (const user of users) {
        insertUser.run(user);
      }
    });

    insertMany(users);
    console.log('✅ Seeded users');

    // Insert departments
    const insertDepartment = db.prepare(`
      INSERT INTO departments (name, code, description)
      VALUES (?, ?, ?)
    `);

    const departments = [
      ['Computer Science & Engineering', 'CSE', 'Department of Computer Science and Engineering'],
      ['Electrical & Electronic Engineering', 'EEE', 'Department of Electrical and Electronic Engineering'],
      ['Business Administration', 'BBA', 'Department of Business Administration'],
      ['English', 'ENG', 'Department of English'],
      ['Law', 'LAW', 'Department of Law and Justice'],
      ['Civil Engineering', 'CE', 'Department of Civil Engineering'],
      ['Pharmacy', 'PHM', 'Department of Pharmacy'],
      ['Biochemistry and Molecular Biology', 'BMB', 'Department of Biochemistry and Molecular Biology'],
      ['Microbiology', 'MCB', 'Department of Microbiology'],
      ['Sociology', 'SOC', 'Department of Sociology'],
      ['Political Science', 'PS', 'Department of Political Science'],
      ['Economics', 'ECO', 'Department of Economics'],
      ['Development Studies', 'DS', 'Department of Development Studies']
    ];

    for (const dept of departments) {
      try {
        insertDepartment.run(dept);
      } catch (e) {
        // Ignore duplicate errors
      }
    }
    console.log('✅ Seeded departments');

    // Insert sample routines
    const insertRoutine = db.prepare(`
      INSERT INTO routines (course, teacher, department, day, start_time, end_time, batch)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const routines = [
      ['Database Systems', 'Dr. John Smith', 'Computer Science & Engineering', 'Monday', '09:00', '10:30', 'D-78A'],
      ['Web Development', 'Prof. Sarah Johnson', 'Computer Science & Engineering', 'Tuesday', '11:00', '12:30', 'D-78B'],
      ['Data Structures', 'Dr. Mike Wilson', 'Computer Science & Engineering', 'Wednesday', '14:00', '15:30', 'E-100']
    ];

    for (const routine of routines) {
      insertRoutine.run(routine);
    }
    console.log('✅ Seeded routines');

    // Insert sample research papers
    const insertPaper = db.prepare(`
      INSERT INTO research_papers (title, author, department, year, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    const papers = [
      ['Machine Learning in Healthcare', 'Dr. Alice Brown', 'Computer Science & Engineering', 2024, 'Published'],
      ['Renewable Energy Solutions', 'Prof. Robert Davis', 'Electrical & Electronic Engineering', 2023, 'Under Review'],
      ['Climate Change Impact', 'Dr. Emily White', 'Environmental Science', 2024, 'Draft']
    ];

    for (const paper of papers) {
      insertPaper.run(paper);
    }
    console.log('✅ Seeded research papers');

    // Insert sample hostel students
    const insertHostel = db.prepare(`
      INSERT INTO hostel_students (student_name, student_id, hostel_name, room_number, department, allocated_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const hostelStudents = [
      ['John Doe', 'CS2024001', 'North Hall', '101', 'Computer Science & Engineering', '2024-01-15'],
      ['Jane Smith', 'EE2024002', 'South Hall', '205', 'Electrical & Electronic Engineering', '2024-01-16'],
      ['Bob Johnson', 'ME2024003', 'East Hall', '310', 'Mechanical Engineering', '2024-01-17']
    ];

    for (const student of hostelStudents) {
      insertHostel.run(student);
    }
    console.log('✅ Seeded hostel students');

    // Load and execute teachers SQL file
    try {
      const teachersSQL = fs.readFileSync(path.join(__dirname, '..', 'database_teachers.sql'), 'utf8');
      db.exec(teachersSQL);
      
      // Count teachers
      const teacherCount = db.prepare('SELECT COUNT(*) as count FROM teachers').get();
      console.log(`✅ Seeded ${teacherCount.count} teachers from SQL file`);
    } catch (error) {
      console.error('❌ Error seeding teachers from SQL:', error.message);
    }

    console.log('🎉 Database seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
}

// ======================================================
// Initialize Database
// ======================================================

initializeDatabase();
seedData();

// ======================================================
// Export Database with MySQL-like API
// ======================================================

// Create MySQL-compatible query wrapper
const queryWrapper = {
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      try {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
          const stmt = db.prepare(sql);
          const rows = params.length > 0 ? stmt.all(params) : stmt.all();
          resolve([rows, []]);
        } else if (sql.trim().toUpperCase().startsWith('INSERT')) {
          const stmt = db.prepare(sql);
          const result = params.length > 0 ? stmt.run(params) : stmt.run();
          resolve([{ insertId: result.lastInsertRowid, affectedRows: result.changes }, []]);
        } else if (sql.trim().toUpperCase().startsWith('UPDATE') || 
                   sql.trim().toUpperCase().startsWith('DELETE')) {
          const stmt = db.prepare(sql);
          const result = params.length > 0 ? stmt.run(params) : stmt.run();
          resolve([{ affectedRows: result.changes }, []]);
        } else {
          db.exec(sql);
          resolve([{ affectedRows: 0 }, []]);
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  
  // Add execute method for compatibility
  execute: function(sql, params) {
    return this.query(sql, params);
  }
};

module.exports = queryWrapper;
