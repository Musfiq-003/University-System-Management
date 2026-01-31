// Seed Database Script - Populate departments and teachers
require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'university_management'
};

async function seedDatabase() {
  let connection;

  try {
    console.log('🌱 Starting database seeding...\n');

    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database\n');

    // Seed Departments
    await seedDepartments(connection);

    // Seed Teachers
    await seedTeachers(connection);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Run test-mysql-connection.js to verify the data');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function seedDepartments(connection) {
  console.log('📚 Seeding departments...');

  const { allDepartments } = require('./data/departments');

  let inserted = 0;
  let skipped = 0;

  for (const dept of allDepartments) {
    try {
      const [result] = await connection.query(`
        INSERT IGNORE INTO departments (name, code, description)
        VALUES (?, ?, ?)
      `, [dept.name, dept.code, `${dept.name}`]);

      if (result.affectedRows > 0) {
        inserted++;
        console.log(`  ✅ Added: ${dept.name} (${dept.code})`);
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(`  ❌ Error adding ${dept.name}:`, error.message);
    }
  }

  console.log(`\n  Summary: ${inserted} departments added, ${skipped} skipped (already exist)`);
}

async function seedTeachers(connection) {
  console.log('\n👨‍🏫 Seeding teachers...');

  const teacherFiles = [
    './data/cseTeachers',
    './data/eeeTeachers',
    './data/civilTeachers',
    './data/bbaTeachers',
    './data/bmbTeachers',
    './data/lawTeachers',
    './data/englishTeachers',
    './data/economicsTeachers',
    './data/politicalScienceTeachers',
    './data/sociologyTeachers',
    './data/developmentStudiesTeachers',
    './data/microbiologyTeachers',
    './data/pharmacyTeachers'
  ];

  let totalInserted = 0;
  let totalSkipped = 0;

  for (const file of teacherFiles) {
    try {
      const teachers = require(file);
      const deptName = file.split('/').pop().replace('Teachers.js', '').replace('Teachers', '');

      console.log(`\n  Processing ${deptName}...`);

      for (const teacher of teachers) {
        try {
          const [result] = await connection.query(`
            INSERT INTO teachers (name, designation, department, email, phone, specialization, image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE name=name
          `, [
            teacher.name,
            teacher.designation,
            teacher.department,
            teacher.email || null,
            teacher.phone || null,
            teacher.specialization || null,
            teacher.image || null
          ]);

          if (result.affectedRows > 0) {
            totalInserted++;
          } else {
            totalSkipped++;
          }
        } catch (error) {
          // Skip duplicates or errors
          totalSkipped++;
        }
      }

      console.log(`    ✅ ${teachers.length} teachers processed`);
    } catch (error) {
      console.log(`    ⚠️  File not found or error: ${file}`);
    }
  }

  console.log(`\n  Summary: ${totalInserted} teachers added, ${totalSkipped} skipped/duplicates`);
}

async function seedUsers(connection) {
  console.log('\n👥 Seeding users...');

  const bcrypt = require('bcryptjs');
  const saltRounds = 10;

  // Default passwords
  const adminPass = await bcrypt.hash('Admin@123', saltRounds);
  const facultyPass = await bcrypt.hash('Faculty@123', saltRounds);
  const studentPass = await bcrypt.hash('Student@123', saltRounds);

  const users = [
    {
      full_name: 'System Administrator',
      email: 'admin@university.edu',
      password_hash: adminPass,
      role: 'admin',
      is_verified: true
    },
    {
      full_name: 'Dr. John Smith',
      email: 'faculty@university.edu',
      password_hash: facultyPass,
      role: 'faculty',
      department: 'Computer Science & Engineering',
      designation: 'Professor',
      is_verified: true
    },
    {
      full_name: 'Jane Doe',
      email: 'student@university.edu',
      password_hash: studentPass,
      role: 'student',
      department: 'Computer Science & Engineering',
      batch: 'D-78A',
      studentId: 'CS2024001',
      is_verified: true
    },
    {
      full_name: 'Test Student',
      email: 'test.student@university.edu',
      password_hash: studentPass,
      role: 'student',
      department: 'BBA',
      batch: 'BBA-20',
      studentId: 'BBA2024001',
      is_verified: true
    }
  ];

  let inserted = 0;
  let skipped = 0;

  for (const user of users) {
    try {
      // Check if user exists
      const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [user.email]);

      if (existing.length === 0) {
        await connection.query(`
          INSERT INTO users (full_name, email, password_hash, role, department, designation, batch, studentId, is_verified)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          user.full_name,
          user.email,
          user.password_hash,
          user.role,
          user.department || null,
          user.designation || null,
          user.batch || null,
          user.studentId || null,
          user.is_verified
        ]);
        inserted++;
        console.log(`  ✅ Added user: ${user.full_name} (${user.role})`);
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(`  ❌ Error adding user ${user.full_name}:`, error.message);
    }
  }

  console.log(`\n  Summary: ${inserted} users added, ${skipped} skipped (already exist)`);
}

// Run the seeding
(async () => {
  // Only run if called directly
  if (require.main === module) {
    await seedDatabase();
  }
})();

// Export for potential external use
module.exports = { seedDatabase, seedUsers };

// Modify seedDatabase to include seedUsers call
const originalSeedDatabase = seedDatabase;
seedDatabase = async function () {
  let connection;
  try {
    console.log('🌱 Starting database seeding...\n');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database\n');

    await seedDepartments(connection);
    await seedTeachers(connection);
    await seedUsers(connection); // New call

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}
