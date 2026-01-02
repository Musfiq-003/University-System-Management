// Mock Database - In-Memory Storage
// This is used when MySQL is not available

// Import data
const { allDepartments } = require('../data/departments');
const cseTeachers = require('../data/cseTeachers');
const { bbaTeachers } = require('../data/bbaTeachers');
const englishTeachers = require('../data/englishTeachers');
const bmbTeachers = require('../data/bmbTeachers');
const eeeTeachers = require('../data/eeeTeachers');
const lawTeachers = require('../data/lawTeachers');
const pharmacyTeachers = require('../data/pharmacyTeachers');
const sociologyTeachers = require('../data/sociologyTeachers');
const politicalScienceTeachers = require('../data/politicalScienceTeachers');
const economicsTeachers = require('../data/economicsTeachers');
const microbiologyTeachers = require('../data/microbiologyTeachers');
const developmentStudiesTeachers = require('../data/developmentStudiesTeachers');
const civilTeachers = require('../data/civilTeachers');

// In-memory data storage
const mockData = {
  users: [
    {
      id: 1,
      full_name: 'System Admin',
      email: 'admin@university.edu',
      password_hash: '$2b$10$MuFjuv6MFgAjHjVbHx6ZCuj12dxCqh7dyc4dPJhwUMzEeQKkRm5bC', // Password: Admin@123
      role: 'admin',
      is_verified: true,
      otp_code: null,
      otp_expiry: null,
      reset_token: null,
      reset_token_expiry: null,
      failed_login_attempts: 0,
      account_locked_until: null,
      created_at: new Date('2025-01-15')
    },
    {
      id: 2,
      full_name: 'Prof. Dr. Md. Abdul Based',
      email: 'based123@gmail.com',
      password_hash: '$2b$10$X/JKX8i5zKtRnVBq9zwwReJLY8hDdn77C8occLfU9R4LHZS1zp1E.', // Password: Faculty@123
      role: 'faculty',
      department: 'Computer Science & Engineering',
      designation: 'Professor',
      is_verified: true,
      otp_code: null,
      otp_expiry: null,
      reset_token: null,
      reset_token_expiry: null,
      failed_login_attempts: 0,
      account_locked_until: null,
      created_at: new Date('2025-02-10')
    },
    {
      id: 3,
      full_name: 'Dr. Shameem Ahmed',
      email: 'shahmeem.cse@diu.ac',
      password_hash: '$2b$10$X/JKX8i5zKtRnVBq9zwwReJLY8hDdn77C8occLfU9R4LHZS1zp1E.', // Password: Faculty@123
      role: 'faculty',
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor',
      is_verified: true,
      otp_code: null,
      otp_expiry: null,
      reset_token: null,
      reset_token_expiry: null,
      failed_login_attempts: 0,
      account_locked_until: null,
      created_at: new Date('2025-03-05')
    },
    {
      id: 4,
      full_name: 'Ahmed Hassan',
      email: 'ahmed.hassan@student.diu.ac',
      password_hash: '$2b$10$8.g9Uu2jepxVnsHKFCgeZOqp1ZaPWmrK39mNXS09Md1tbWgQn1hS2', // Password: Student@123
      role: 'student',
      department: 'Computer Science & Engineering',
      batch: 'D-78A',
      studentId: 'CS2024001',
      is_verified: true,
      otp_code: null,
      otp_expiry: null,
      reset_token: null,
      reset_token_expiry: null,
      failed_login_attempts: 0,
      account_locked_until: null,
      created_at: new Date('2025-04-20')
    },
    {
      id: 5,
      full_name: 'Fatima Rahman',
      email: 'fatima.rahman@student.diu.ac',
      password_hash: '$2b$10$8.g9Uu2jepxVnsHKFCgeZOqp1ZaPWmrK39mNXS09Md1tbWgQn1hS2', // Password: Student@123
      role: 'student',
      department: 'Computer Science & Engineering',
      batch: 'D-78A',
      studentId: 'CS2024002',
      is_verified: true,
      otp_code: null,
      otp_expiry: null,
      reset_token: null,
      reset_token_expiry: null,
      failed_login_attempts: 0,
      account_locked_until: null,
      created_at: new Date('2025-05-12')
    },
    {
      id: 6,
      full_name: 'Karim Abdullah',
      email: 'karim.abdullah@student.diu.ac',
      password_hash: '$2b$10$8.g9Uu2jepxVnsHKFCgeZOqp1ZaPWmrK39mNXS09Md1tbWgQn1hS2', // Password: Student@123
      role: 'student',
      department: 'Electrical & Electronic Engineering',
      batch: 'E-100',
      studentId: 'EEE2024001',
      is_verified: true,
      otp_code: null,
      otp_expiry: null,
      reset_token: null,
      reset_token_expiry: null,
      failed_login_attempts: 0,
      account_locked_until: null,
      created_at: new Date('2025-06-08')
    },
    {
      id: 7,
      full_name: 'Ms. Sraboni Barua',
      email: 'baruasraboni@yahoo.com',
      password_hash: '$2b$10$X/JKX8i5zKtRnVBq9zwwReJLY8hDdn77C8occLfU9R4LHZS1zp1E.', // Password: Faculty@123
      role: 'faculty',
      department: 'Computer Science & Engineering',
      designation: 'Lecturer',
      is_verified: true,
      otp_code: null,
      otp_expiry: null,
      reset_token: null,
      reset_token_expiry: null,
      failed_login_attempts: 0,
      account_locked_until: null,
      created_at: new Date('2025-07-15')
    },
    {
      id: 8,
      full_name: 'Nusrat Jahan',
      email: 'nusrat.jahan@student.diu.ac',
      password_hash: '$2b$10$8.g9Uu2jepxVnsHKFCgeZOqp1ZaPWmrK39mNXS09Md1tbWgQn1hS2', // Password: Student@123
      role: 'pending',
      is_verified: true,
      otp_code: null,
      otp_expiry: null,
      reset_token: null,
      reset_token_expiry: null,
      failed_login_attempts: 0,
      account_locked_until: null,
      created_at: new Date('2025-12-20')
    },
    {
      id: 9,
      full_name: 'Mehedi Hasan',
      email: 'mehedi.hasan@student.diu.ac',
      password_hash: '$2b$10$8.g9Uu2jepxVnsHKFCgeZOqp1ZaPWmrK39mNXS09Md1tbWgQn1hS2', // Password: Student@123
      role: 'pending',
      is_verified: true,
      otp_code: null,
      otp_expiry: null,
      reset_token: null,
      reset_token_expiry: null,
      failed_login_attempts: 0,
      account_locked_until: null,
      created_at: new Date('2025-12-22')
    }
  ],
  routines: [],
  research: [],
  hostel: [],
  departments: allDepartments,
  teachers: [...cseTeachers, ...bbaTeachers, ...englishTeachers, ...bmbTeachers, ...eeeTeachers, ...lawTeachers, ...pharmacyTeachers, ...sociologyTeachers, ...politicalScienceTeachers, ...economicsTeachers, ...microbiologyTeachers, ...developmentStudiesTeachers, ...civilTeachers]
};

let userIdCounter = 10;
let routineIdCounter = 1;
let researchIdCounter = 1;
let hostelIdCounter = 1;

// Mock query function
const query = async (sql, params = []) => {
  console.log('Mock Query:', sql);
  console.log('Params:', params);

  // Handle SELECT queries
  if (sql.toUpperCase().includes('SELECT')) {
    
    // Get all users (admin)
    if (sql.includes('SELECT id, full_name, email, role, is_verified, created_at FROM users')) {
      return [mockData.users.map(u => ({
        id: u.id,
        full_name: u.full_name,
        email: u.email,
        role: u.role,
        is_verified: u.is_verified,
        created_at: u.created_at
      }))];
    }
    
    // Get user by email
    if (sql.includes('WHERE email = ?')) {
      const email = params[0];
      const user = mockData.users.find(u => u.email === email);
      return [user ? [user] : []];
    }

    // Get user by ID
    if (sql.includes('WHERE id = ?')) {
      const id = params[0];
      const user = mockData.users.find(u => u.id === parseInt(id));
      return [user ? [user] : []];
    }

    // Get user by reset token
    if (sql.includes('WHERE reset_token = ?')) {
      const token = params[0];
      const user = mockData.users.find(u => u.reset_token === token);
      return [user ? [user] : []];
    }

    // Select all routines
    if (sql.includes('FROM routines')) {
      return [mockData.routines];
    }

    // Select all research
    if (sql.includes('FROM research')) {
      return [mockData.research];
    }

    // Select all hostel
    if (sql.includes('FROM hostel')) {
      return [mockData.hostel];
    }
    
    // Select all departments
    if (sql.includes('FROM departments')) {
      return [mockData.departments];
    }
    
    // Select all teachers
    if (sql.includes('FROM teachers')) {
      // Filter by department if specified
      if (params.length > 0 && params[0]) {
        const department = params[0];
        return [mockData.teachers.filter(t => t.department === department)];
      }
      return [mockData.teachers];
    }
  }

  // Handle INSERT queries
  if (sql.toUpperCase().includes('INSERT INTO')) {
    
    // Insert user
    if (sql.includes('INSERT INTO users')) {
      const [full_name, email, password_hash, role, otp_code, otp_expiry] = params;
      const newUser = {
        id: userIdCounter++,
        full_name,
        email,
        password_hash,
        role,
        is_verified: false,
        otp_code,
        otp_expiry,
        reset_token: null,
        reset_token_expiry: null,
        failed_login_attempts: 0,
        account_locked_until: null,
        created_at: new Date()
      };
      mockData.users.push(newUser);
      return [{ insertId: newUser.id, affectedRows: 1 }];
    }

    // Insert routine
    if (sql.includes('INSERT INTO routines')) {
      const newRoutine = {
        id: routineIdCounter++,
        ...params
      };
      mockData.routines.push(newRoutine);
      return [{ insertId: newRoutine.id, affectedRows: 1 }];
    }

    // Insert research
    if (sql.includes('INSERT INTO research')) {
      const newResearch = {
        id: researchIdCounter++,
        ...params
      };
      mockData.research.push(newResearch);
      return [{ insertId: newResearch.id, affectedRows: 1 }];
    }

    // Insert hostel
    if (sql.includes('INSERT INTO hostel')) {
      const newHostel = {
        id: hostelIdCounter++,
        ...params
      };
      mockData.hostel.push(newHostel);
      return [{ insertId: newHostel.id, affectedRows: 1 }];
    }
  }

  // Handle UPDATE queries
  if (sql.toUpperCase().includes('UPDATE')) {
    
    // Update user OTP
    if (sql.includes('UPDATE users') && sql.includes('otp_code = ?')) {
      const [otp_code, otp_expiry, email] = params;
      const user = mockData.users.find(u => u.email === email);
      if (user) {
        user.otp_code = otp_code;
        user.otp_expiry = otp_expiry;
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }

    // Verify user email
    if (sql.includes('is_verified = TRUE')) {
      const email = params[0];
      const user = mockData.users.find(u => u.email === email);
      if (user) {
        user.is_verified = true;
        user.otp_code = null;
        user.otp_expiry = null;
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }

    // Update failed login attempts
    if (sql.includes('failed_login_attempts = ?')) {
      const [attempts, locked_until, email] = params;
      const user = mockData.users.find(u => u.email === email);
      if (user) {
        user.failed_login_attempts = attempts;
        user.account_locked_until = locked_until;
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }

    // Reset failed login attempts
    if (sql.includes('failed_login_attempts = 0')) {
      const email = params[0];
      const user = mockData.users.find(u => u.email === email);
      if (user) {
        user.failed_login_attempts = 0;
        user.account_locked_until = null;
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }

    // Update reset token
    if (sql.includes('reset_token = ?')) {
      const [reset_token, reset_token_expiry, email] = params;
      const user = mockData.users.find(u => u.email === email);
      if (user) {
        user.reset_token = reset_token;
        user.reset_token_expiry = reset_token_expiry;
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }

    // Update password
    if (sql.includes('password_hash = ?')) {
      const [password_hash, email] = params;
      const user = mockData.users.find(u => u.email === email);
      if (user) {
        user.password_hash = password_hash;
        user.reset_token = null;
        user.reset_token_expiry = null;
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }
    
    // Update user role (admin)
    if (sql.includes('UPDATE users SET role = ? WHERE id = ?')) {
      const [role, userId] = params;
      const user = mockData.users.find(u => u.id === parseInt(userId));
      if (user) {
        user.role = role;
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }
  }

  // Handle DELETE queries
  if (sql.toUpperCase().includes('DELETE')) {
    // Add delete logic as needed
    return [{ affectedRows: 0 }];
  }

  // Default response
  return [[]];
};

// Export mock database
module.exports = {
  query,
  mockData // Export data for testing/debugging
};
